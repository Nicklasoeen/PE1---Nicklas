const API_URL = 'https://v2.api.noroff.dev';

function getPostIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function getOwnerName() {
  return localStorage.getItem('userName');
}

function showMessage(message, isSuccess = false) {
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = isSuccess ? 'success-message' : 'error-message';
  }
}

async function fetchPost(postId, ownerName) {
  try {
    const response = await fetch(`${API_URL}/blog/posts/${ownerName}/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Edit Post Fetch Response:', { status: response.status, data });

    if (response.ok && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function updatePost(postId, ownerName, token, payload) {
  const response = await fetch(`${API_URL}/blog/posts/${ownerName}/${postId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log('Edit Post Update Response:', { status: response.status, data });

  if (response.ok && data.data) {
    return data.data;
  }

  return null;
}

async function deletePost(postId, ownerName, token) {
  const response = await fetch(`${API_URL}/blog/posts/${ownerName}/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.warn('Delete response was not JSON:', error);
    }
  }
  console.log('Edit Post Delete Response:', { status: response.status, data });

  return response.ok;
}

function populateForm(post) {
  document.getElementById('title').value = post.title || '';
  document.getElementById('body').value = post.body || '';
  document.getElementById('mediaUrl').value = post.media?.url || '';
  document.getElementById('mediaAlt').value = post.media?.alt || '';
}

function buildPayload() {
  const title = document.getElementById('title').value.trim();
  const body = document.getElementById('body').value.trim();
  const mediaUrl = document.getElementById('mediaUrl').value.trim();
  const mediaAlt = document.getElementById('mediaAlt').value.trim();

  if (!title || !body) {
    showMessage('Title and content are required');
    return null;
  }

  if (title.length < 3) {
    showMessage('Title must be at least 3 characters');
    return null;
  }

  if (body.length < 10) {
    showMessage('Content must be at least 10 characters');
    return null;
  }

  const payload = { title, body };

  if (mediaUrl) {
    if (!mediaAlt) {
      showMessage('Please provide alt text for the image');
      return null;
    }
    payload.media = { url: mediaUrl, alt: mediaAlt };
  }

  return payload;
}

async function handleUpdate(postId, ownerName) {
  const token = getToken();
  if (!token) {
    showMessage('You must be logged in to edit posts.');
    return;
  }

  const payload = buildPayload();
  if (!payload) return;

  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Updating...';
  submitBtn.disabled = true;

  try {
    const updated = await updatePost(postId, ownerName, token, payload);
    if (updated) {
      showMessage('Post updated successfully! Redirecting...', true);
      setTimeout(() => {
        window.location.href = `index.html?id=${postId}`;
      }, 1200);
    } else {
      showMessage('Failed to update post. Please try again.');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    showMessage('An error occurred. Please try again later.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

async function handleDelete(postId, ownerName) {
  const token = getToken();
  if (!token) {
    showMessage('You must be logged in to delete posts.');
    return;
  }

  const confirmed = window.confirm('Are you sure you want to delete this post?');
  if (!confirmed) return;

  const deleteBtn = document.getElementById('deletePostBtn');
  const originalText = deleteBtn.textContent;
  deleteBtn.textContent = 'Deleting...';
  deleteBtn.disabled = true;

  try {
    const deleted = await deletePost(postId, ownerName, token);
    if (deleted) {
      showMessage('Post deleted. Redirecting...', true);
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    } else {
      showMessage('Failed to delete post. Please try again.');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    showMessage('An error occurred. Please try again later.');
  } finally {
    deleteBtn.textContent = originalText;
    deleteBtn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn()) {
    window.location.href = '../account/login.html';
    return;
  }

  const postId = getPostIdFromUrl();
  const ownerName = getOwnerName();

  if (!postId || !ownerName) {
    showMessage('Missing post ID or user context.');
    return;
  }

  const post = await fetchPost(postId, ownerName);
  if (!post) {
    showMessage('Post not found or access denied.');
    return;
  }

  populateForm(post);

  const form = document.getElementById('editPostForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      handleUpdate(postId, ownerName);
    });
  }

  const deleteBtn = document.getElementById('deletePostBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => handleDelete(postId, ownerName));
  }
});
