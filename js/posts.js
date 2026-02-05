const API_URL = 'https://v2.api.noroff.dev';
const BLOG_OWNER = 'Nicklasoeen';

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
  
 
  if (!postsContainer) {
    console.error('Posts container not found');
    return;
  }
  

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = '<p>No posts found</p>';
    return;
  }
  

  postsContainer.innerHTML = '';
  

  posts.forEach(post => {

    const postHTML = `
      <article class="post-card">
        <h2>${post.title}</h2>
        <p class="post-author">By ${post.author.name}</p>
        <p class="post-date">${new Date(post.created).toLocaleDateString()}</p>
        
        ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}" class="post-image">` : ''}
        
        <p class="post-body">${post.body.substring(0, 200)}...</p>
        
        <div class="post-meta">
          <span class="post-tags">${post.tags ? post.tags.join(', ') : 'No tags'}</span>
          <span class="post-comments">${post._count?.comments || 0} comments</span>
        </div>
        
        <a href="/post/index.html?id=${post.id}" class="read-more">Read More →</a>
      </article>
    `;
    

    postsContainer.innerHTML += postHTML;
  });
}

function showPostsError(message) {
  const postsContainer = document.getElementById('postsContainer');
  if (postsContainer) {
    postsContainer.innerHTML = `<p class="error">${message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  const postsContainer = document.getElementById('postsContainer');
  if (postsContainer) {
    postsContainer.innerHTML = '<p>Loading posts...</p>';
  }
  

  const posts = await fetchPosts();
  

  if (posts) {
    displayPosts(posts);
  }
});