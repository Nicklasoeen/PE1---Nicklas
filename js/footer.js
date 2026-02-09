function loadFooter() {
  fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => console.error('Error loading footer:', error));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}
