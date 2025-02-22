import { auth, signOut, getUserName, setUserName } from './auth.js';

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

        const user = auth.currentUser;
        let displayName = 'Login';
        let dropdownContent = '';
        
        if (user) {
            displayName = await getUserName(user.uid);
            dropdownContent = `
                <div class="dropdown-content">
                    <a href="#" class="change-name">Change Pilot Name</a>
                    <a href="#" class="sign-out">Sign Out</a>
                </div>
            `;
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
            <div class="dropdown">
                <a href="#" class="${loginClass}">${displayName}</a>
                ${dropdownContent}
            </div>
        `;

        if (user) {
            // Add event listener for changing name
            nav.querySelector('.change-name').addEventListener('click', async (e) => {
                e.preventDefault();
                const newName = prompt('Enter your new pilot name:');
                if (newName && newName.trim()) {
                    try {
                        await setUserName(user.uid, newName.trim());
                        // Update the display name immediately after setting
                        const loginLink = nav.querySelector('.login-link');
                        loginLink.textContent = newName.trim();
                        location.reload(); // Refresh to update all instances
                    } catch (error) {
                        console.error('Error setting pilot name:', error);
                    }
                }
            });

            // Add event listener for sign out
            nav.querySelector('.sign-out').addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await signOut(auth);
                    location.reload();
                } catch (error) {
                    console.error('Error signing out:', error);
                }
            });
        } else {
            nav.querySelector('.login-link').addEventListener('click', (e) => {
                e.preventDefault();
                showAuthModal();
            });
        }

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