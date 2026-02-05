const API_URL = 'https://v2.api.noroff.dev';


document.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) {
    window.location.href = '/account/login.html';
    return;
  }

  const createPostForm = document.getElementById('createPostForm');
  if (createPostForm) {
    createPostForm.addEventListener('submit', handleCreatePost);
  }
});

async function handleCreatePost(event) {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('body').value.trim();
  const tagsInput = document.getElementById('tags').value.trim();
  const mediaUrl = document.getElementById('mediaUrl').value.trim();
  const mediaAlt = document.getElementById('mediaAlt').value.trim();

  if (!title || !body) {
    showError('Title and content are required');
    return;
  }

  if (title.length < 3) {
    showError('Title must be at least 3 characters');
    return;
  }

  if (body.length < 10) {
    showError('Content must be at least 10 characters');
    return;
  }

  const tags = tagsInput
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);


  const requestData = {
    title,
    body,
    tags,
  };


  if (mediaUrl) {
    if (!mediaAlt) {
      showError('Please provide alt text for the image');
      return;
    }
    requestData.media = {
      url: mediaUrl,
      alt: mediaAlt,
    };
  }

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Publishing...';
  submitBtn.disabled = true;

  try {
    const token = getToken();
    const userName = localStorage.getItem('userName');

    const response = await fetch(`${API_URL}/blog/posts/${userName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    console.log('Create Post Response:', { status: response.status, data });

    if (response.ok && data.data) {
      showError('Post published successfully! Redirecting...', true);
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1500);
    } else {
      let errorMsg = 'Failed to create post. Please try again.';

      if (data.errors && Array.isArray(data.errors)) {
        errorMsg = data.errors.map(e => e.message || String(e)).join(', ');
      } else if (data.statusMessage) {
        errorMsg = data.statusMessage;
      } else if (data.message) {
        errorMsg = data.message;
      }

      console.error('Create post error:', errorMsg);
      showError(errorMsg);
    }
  } catch (error) {
    console.error('Error creating post:', error);
    showError('An error occurred. Please try again later.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function showError(message, isSuccess = false) {
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = isSuccess
      ? 'success-message'
      : 'error-message';
  }
}
