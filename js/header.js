// Load header on all pages
function loadHeader() {
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      // Insert header at the beginning of body
      document.body.insertAdjacentHTML('afterbegin', data);
      // Link CSS if not already linked
      if (!document.querySelector('link[href*="styles.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/styles.css';
        document.head.appendChild(link);
      }
    })
    .catch(error => console.error('Error loading header:', error));
}

// Load header when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeader);
} else {
  loadHeader();
}
