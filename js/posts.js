const API_URL = 'https://v2.api.noroff.dev';
const BLOG_OWNER = 'Nicklasoeen';
const DEFAULT_CAROUSEL_IMAGE =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

async function fetchPosts() {
  try {
    const response = await fetch(`${API_URL}/blog/posts/${BLOG_OWNER}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

        const data = await response.json();
        
        console.log('API Response:', { status: response.status, data });

        if (response.ok && data.data) {
            return data.data;
        } else {
            showPostsError('Failed to fetch posts. Please try again later.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        showPostsError('An error occurred while fetching posts. Please try again later.');
        return null;
    }
}

function displayPosts(posts) {
  const postsContainer = document.getElementById('postsContainer');
  const slider = document.getElementById('slider');
  
 
  if (!postsContainer) {
    console.error('Posts container not found');
    return;
  }

  if (slider) {
    renderSlider(posts, slider);
  }
  

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = '<p>No posts found</p>';
    return;
  }
  

  postsContainer.innerHTML = '';

  const sortedPosts = [...posts].sort((a, b) => {
    const aDate = new Date(a.created || 0).getTime();
    const bDate = new Date(b.created || 0).getTime();
    return bDate - aDate;
  });

  const visiblePosts = sortedPosts.slice(0, 12);

  visiblePosts.forEach(post => {

    const mediaUrl = post.media?.url || null;
    const mediaAlt = post.media?.alt || 'Post image';
    const dateFormatted = new Date(post.created).toLocaleDateString();
    const authorName = post.author?.name || 'Unknown';

    const postHTML = `
      <article class="post-card">
        ${mediaUrl ? `<img src="${mediaUrl}" alt="${mediaAlt}" class="post-image">` : ''}
        <div class="post-card-content">
          <div class="post-card-meta">
            <span>${dateFormatted}</span>
            <span>•</span>
            <span>${authorName}</span>
          </div>
          <h2>${post.title}</h2>
          <p class="post-body">${(post.body || '').substring(0, 90)}...</p>
          <a href="/post/index.html?id=${post.id}" class="read-more">Read more →</a>
        </div>
      </article>
    `;
    

    postsContainer.innerHTML += postHTML;
  });
}

function renderSlider(posts, container) {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.created || 0) - new Date(a.created || 0)
  );
  const latestPosts = sortedPosts.slice(0, 3);

  container.innerHTML = `
    ${latestPosts.map((post, index) => {
      const imgUrl = post.media?.url || DEFAULT_CAROUSEL_IMAGE;
      const title = post.title || 'Untitled';
      const date = post.created ? new Date(post.created).toLocaleDateString() : '';
      const author = post.author?.name || 'Unknown';
      const excerpt = (post.body || '').substring(0, 120);

      return `
        <div class="slide ${index === 0 ? 'active' : ''}">
          <img src="${imgUrl}" alt="${title}" onerror="this.src='${DEFAULT_CAROUSEL_IMAGE}'">
          <div class="slide-content">
            <span class="slide-meta">${date} • ${author}</span>
            <h2>${title}</h2>
            <p>${excerpt}...</p>
            <a href="/post/index.html?id=${post.id}" class="slide-btn">Read more →</a>
          </div>
        </div>
      `;
    }).join('')}
    <button class="slider-prev">‹</button>
    <button class="slider-next">›</button>
    <div class="slider-dots"></div>
  `;

  initSlider();
}

function showPostsError(message) {
  const postsContainer = document.getElementById('postsContainer');
  if (postsContainer) {
    postsContainer.innerHTML = `<p class="error">${message}</p>`;
  }
  const slider = document.getElementById('slider');
  if (slider) {
    slider.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  const postsContainer = document.getElementById('postsContainer');
  if (postsContainer) {
    postsContainer.innerHTML = '<p>Loading posts...</p>';
  }
  

  const posts = await fetchPosts();
  
  if (posts) {
    window.latestPosts = posts;
  }

  if (posts) {
    displayPosts(posts);
  }
});