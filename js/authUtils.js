function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
}


function getToken() {
  return localStorage.getItem('accessToken');
}


function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html';
}
