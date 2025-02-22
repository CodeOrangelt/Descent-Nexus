document.addEventListener('DOMContentLoaded', () => {
    fetch('.nav.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('.nav-placeholder').innerHTML = html;
            highlightCurrentPage();
        })
        .catch(error => console.error('Error loading navigation:', error));
});

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav a').forEach(link => {
        if (currentPath.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}