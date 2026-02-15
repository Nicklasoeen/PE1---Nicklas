const API_URL = 'https://v2.api.noroff.dev';
const BLOG_OWNER = 'Nicklasoeen';
const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop';

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// fetch single post from API
function getOwnerName() {
  return localStorage.getItem('userName') || BLOG_OWNER;
}

async function fetchSinglePost(postId) {
  try {
    const ownerName = getOwnerName();
    const response = await fetch(`${API_URL}/blog/posts/${ownerName}/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Single Post API Response:', { status: response.status, data });

    if (response.ok && data.data) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

function sharePost() {
  const url = window.location.href;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showShareToast('Link copied!');
    }).catch(() => {
      fallbackShare(url);
    });
  } else {
    fallbackShare(url);
  }
}

function fallbackShare(url) {
  const input = document.createElement('input');
  input.value = url;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showShareToast('Link copied!');
}

function showShareToast(message) {
  const existing = document.querySelector('.share-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function renderPost(post) {
  const container = document.getElementById('postContent');
  
  if (!post) {
    container.innerHTML = `
      <div class="post-error">
        <h1>Post not found</h1>
        <p>Sorry, we couldn’t find the post you’re looking for.</p>
        <a href="/" class="back-btn">← Back to home</a>
      </div>
    `;
    document.title = 'Post not found';
    return;
  }

  const imageUrl = post.media?.url || DEFAULT_POST_IMAGE;
  const imageAlt = post.media?.alt || post.title;
  const authorName = post.author?.name || 'Unknown author';
  const publishDate = post.created ? new Date(post.created).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  const updatedDate = post.updated ? new Date(post.updated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  const currentUser = localStorage.getItem('userName');
  const isOwner = currentUser && post.author?.name === currentUser;

  document.title = post.title + ' | Tech Blog';

  container.className = '';
  container.innerHTML = `
    <a href="/" class="back-link">← Back to home</a>
    
    <div class="post-banner">
      <img src="${imageUrl}" alt="${imageAlt}" onerror="this.src='${DEFAULT_POST_IMAGE}'">
    </div>

    <div class="post-header">
      <div class="post-meta-info">
        <span class="post-author-name">${authorName}</span>
        <span class="meta-divider">•</span>
        <time datetime="${post.created}">${publishDate}</time>
        ${updatedDate && updatedDate !== publishDate ? `<span class="meta-divider">•</span><span>Updated: ${updatedDate}</span>` : ''}
      </div>
      
      <h1 class="post-title">${post.title}</h1>
      
      ${post.tags && post.tags.length > 0 ? `
        <div class="post-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
      
      <div class="post-header-actions">
        ${isOwner ? `<a href="/post/edit.html?id=${post.id}" class="share-btn" title="Edit post">Edit</a>` : ''}
        <button class="share-btn" onclick="sharePost()" title="Share post">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
      </div>
    </div>

    <div class="post-body-content">
      ${formatPostBody(post.body)}
    </div>

    <div class="post-footer">
      <a href="/" class="back-btn">← Back to all posts</a>
      <button class="share-btn" onclick="sharePost()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share post
      </button>
    </div>
  `;
}

function formatPostBody(body) {
  if (!body) return '<p>No content available.</p>';
  
  const paragraphs = body.split(/\n\n+/);
  
  return paragraphs
    .map(p => {
      const formatted = p.trim().replace(/\n/g, '<br>');
      return formatted ? `<p>${formatted}</p>` : '';
    })
    .filter(p => p)
    .join('');
}

// initialize page
document.addEventListener('DOMContentLoaded', async () => {
  const postId = getPostIdFromUrl();
  
  if (!postId) {
    renderPost(null);
    return;
  }

  const post = await fetchSinglePost(postId);
  renderPost(post);
});
