function updateNavigation() {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;

  const loginLink = navList.querySelector('.nav-login');
  const registerLink = navList.querySelector('.nav-register');
  const createPostLink = navList.querySelector('.nav-create');
  const logoutLink = navList.querySelector('.nav-logout');

  if (isLoggedIn()) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (createPostLink) createPostLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'block';

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn.hasAttribute('data-listener')) {
      logoutBtn.setAttribute('data-listener', 'true');
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // not logged in: show login/register and hide create/logout
    if (loginLink) loginLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'block';
    if (createPostLink) createPostLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateNavigation);
} else {
  updateNavigation();
}
