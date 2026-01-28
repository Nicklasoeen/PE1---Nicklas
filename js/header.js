
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
    })
    .catch(error => console.error('Error loading header:', error));
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeader);
} else {
  loadHeader();
}
