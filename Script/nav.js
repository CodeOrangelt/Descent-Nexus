import { auth, signInWithEmailAndPassword } from './auth.js';

// Define showAuthModal function
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    function getPathToRoot() {
        const path = window.location.pathname;
        return path.includes('/HTML/') ? '../' : './';
    }

    function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';

        const rootPath = getPathToRoot();
        
        nav.innerHTML = `
            <h1 class="nav-title">Descent Nexus</h1>
            <hr>
            <a href="${rootPath}index.html">Nexus</a>
            <a href="https://rdl.descentnexus.com" target="_blank">RDL</a>
            <a href="${rootPath}HTML/news.html">News</a>
            <a href="${rootPath}HTML/projectd.html">Project D</a>
            <hr>
            <a href="#" class="login-link">Login</a>
        `;

        // Add click event listener for login
        nav.querySelector('.login-link').addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal();
        });

        return nav;
    }

    // Initialize navigation
    const existingNav = document.querySelector('.nav');
    if (existingNav) {
        existingNav.replaceWith(createNavigation());
    } else {
        document.body.prepend(createNavigation());
    }
});

// Optional: Add dynamic notification update
async function updateNotifications() {
    try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        
        const badge = document.getElementById('badge');
        if (badge) {
            badge.style.display = data.hasNotifications ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
    }
}

// Check for notifications periodically
setInterval(updateNotifications, 60000);

// Single export statement
export { showAuthModal };