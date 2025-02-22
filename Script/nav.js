// Add import at the top
import { showAuthModal } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    function getPathToRoot() {
        const path = window.location.pathname;
        return path.includes('/HTML/') ? '../' : './';
    }

    function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';

        const rootPath = getPathToRoot();
        
        // Create nav content
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

        // Add event listener after creating the element
        nav.querySelector('.login-link').addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.showAuthModal === 'function') {
                window.showAuthModal();
            } else {
                console.error('Auth modal function not available');
            }
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
setInterval(updateNotifications, 60000); // Check every minute