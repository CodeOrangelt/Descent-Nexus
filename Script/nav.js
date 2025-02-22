import { auth, signOut, getUserName } from './auth.js';

// Define showAuthModal function
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    function getPathToRoot() {
        const path = window.location.pathname;
        return path.includes('/HTML/') ? '../' : './';
    }

    async function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';

        // Check if user is logged in and get username
        const user = auth.currentUser;
        let displayName = 'Login';
        if (user) {
            displayName = await getUserName(user.uid);
            displayName += ' (Sign Out)';
        }
        const loginClass = user ? 'login-link logged-in' : 'login-link';

        const rootPath = getPathToRoot();
        
        nav.innerHTML = `
            <h1 class="nav-title">Descent Nexus</h1>
            <hr>
            <a href="${rootPath}index.html">Nexus</a>
            <a href="https://rdl.descentnexus.com" target="_blank">RDL</a>
            <a href="${rootPath}HTML/news.html">News</a>
            <a href="${rootPath}HTML/projectd.html">Project D</a>
            <hr>
            <a href="#" class="${loginClass}">${displayName}</a>
        `;

        // Add click event listener for login/logout
        nav.querySelector('.login-link').addEventListener('click', async (e) => {
            e.preventDefault();
            if (auth.currentUser) {
                try {
                    await signOut(auth);
                    location.reload(); // Refresh to update UI
                } catch (error) {
                    console.error('Error signing out:', error);
                }
            } else {
                showAuthModal();
            }
        });

        return nav;
    }

    // Initialize navigation
    const existingNav = document.querySelector('.nav');
    if (existingNav) {
        existingNav.replaceWith(await createNavigation());
    } else {
        document.body.prepend(await createNavigation());
    }

    // Listen for auth state changes
    auth.onAuthStateChanged(async () => {
        const existingNav = document.querySelector('.nav');
        if (existingNav) {
            existingNav.replaceWith(await createNavigation());
        }
    });
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