function loadHeader() {
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {

      document.body.insertAdjacentHTML('afterbegin', data);

      if (!document.querySelector('link[href*="styles.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/styles.css';
        document.head.appendChild(link);
      }

      updateNavigation();
    })
    .catch(error => console.error('Error loading header:', error));
}

function updateNavigation() {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;

  const loginLink = navList.querySelector('a[href="/account/login.html"]');
  const registerLink = navList.querySelector('a[href="/account/register.html"]');
  const logoutItem = navList.querySelector('.logout-item');
  const createPostItem = navList.querySelector('.create-post-item');

  if (isLoggedIn()) {

    if (loginLink) loginLink.parentElement.style.display = 'none';
    if (registerLink) registerLink.parentElement.style.display = 'none';


    if (!createPostItem) {
      const createPostLi = document.createElement('li');
      createPostLi.className = 'create-post-item';
      createPostLi.innerHTML = '<a href="/post/create.html">Create post</a>';
      navList.appendChild(createPostLi);
    } else {
      createPostItem.style.display = 'block';
    }

    if (!logoutItem) {
      const logoutLi = document.createElement('li');
      logoutLi.className = 'logout-item';
      logoutLi.innerHTML = '<a href="#" id="logoutBtn">Logout</a>';
      navList.appendChild(logoutLi);

      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {

    if (loginLink) loginLink.parentElement.style.display = 'block';
    if (registerLink) registerLink.parentElement.style.display = 'block';

    if (createPostItem) createPostItem.style.display = 'none';
    if (logoutItem) logoutItem.style.display = 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeader);
} else {
  loadHeader();
}