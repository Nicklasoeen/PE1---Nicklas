// Load footer on all pages
function loadFooter() {
  fetch('/footer.html')
    .then(response => response.text())
    .then(data => {
      // Insert footer before closing body tag
      document.body.insertAdjacentHTML('beforeend', data);
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Load footer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFooter);
} else {
  loadFooter();
}
