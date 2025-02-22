function switchTab(tabId) {
    // Remove active class from all buttons and tabs
    document.querySelectorAll('.hrbutton').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active class to selected button and tab
    document.querySelector(`.hrbutton[onclick*="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Initialize the first tab
document.addEventListener('DOMContentLoaded', () => {
    switchTab('news');
});