function switchTab(tabId) {
    // Update nav links
    document.querySelectorAll('.content-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[href="#${tabId}"]`).classList.add('active');

    // Update content sections
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Initialize the first tab
document.addEventListener('DOMContentLoaded', () => {
    switchTab('news');
});