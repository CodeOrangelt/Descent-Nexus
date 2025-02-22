document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    const firebaseConfig = {
        // Your Firebase config here
        apiKey: "AIzaSyDMF-bq4tpLoZvUYep_G-igmHbK2h-e-Zs",
        authDomain: "rdladder.firebaseapp.com",
        projectId: "rdladder",
        storageBucket: "rdladder.firebasestorage.app",
        messagingSenderId: "152922774046",
        appId: "1:152922774046:web:c14bd25f07ad1aa0366c0f",
        measurementId: "G-MXVPNC0TVJ"
    };

    // Initialize Firebase if not already initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Function to get relative path to root
    function getPathToRoot() {
        const path = window.location.pathname;
        // Check if we're in the HTML directory
        if (path.includes('/HTML/')) {
            return '../';
        }
        return './';
    }

    // Configuration for navigation items
    const navConfig = [
        { path: './index.html', text: 'Nexus' },
        { path: 'https://rdl.descentnexus.com', text: 'RDL', target: '_blank' },
        { path: './HTML/news.html', text: 'News' },
        { path: './HTML/projectd.html', text: 'Project D' },
        { type: 'divider' },
        { id: 'authLinks', dynamic: true } // Dynamic auth links
    ];

    // Function to update auth links
    function updateAuthLinks(nav) {
        const authLinksContainer = nav.querySelector('#authLinks');
        if (!authLinksContainer) return;

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                authLinksContainer.innerHTML = `
                    <a href="./HTML/profile.html">${user.displayName || user.email}</a>
                    <a href="#" id="signOutBtn">Sign Out</a>
                `;
                // Add sign out handler
                document.getElementById('signOutBtn').addEventListener('click', (e) => {
                    e.preventDefault();
                    firebase.auth().signOut();
                });
            } else {
                // User is signed out
                authLinksContainer.innerHTML = `
                    <a href="./HTML/login.html">Login</a>
                    <a href="./HTML/signup.html">Sign up</a>
                `;
            }
        });
    }

    // Function to create navigation
    function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';
        const rootPath = getPathToRoot();

        // Add title
        const title = document.createElement('h1');
        title.className = 'nav-title';
        title.textContent = 'Descent Nexus';
        nav.appendChild(title);

        // Add first divider
        nav.appendChild(document.createElement('hr'));

        // Create navigation items with correct paths
        navConfig.forEach(item => {
            if (item.type === 'divider') {
                nav.appendChild(document.createElement('hr'));
            } else if (item.dynamic) {
                const container = document.createElement('div');
                container.id = item.id;
                nav.appendChild(container);
            } else {
                const link = document.createElement('a');
                
                // Handle paths based on location
                if (item.path.startsWith('http')) {
                    link.href = item.path;
                } else {
                    // Remove ./ from the beginning if we're already at root
                    const finalPath = rootPath === './' ? 
                        item.path.replace('./', '') : 
                        item.path.replace('./', '');
                    link.href = `${rootPath}${finalPath}`;
                }
                
                link.textContent = item.text;
                
                if (item.target) {
                    link.target = item.target;
                }
                
                if (item.class) {
                    link.className = item.class;
                }

                // Highlight current page
                const currentPath = window.location.pathname.split('/').pop();
                if (item.path.endsWith(currentPath)) {
                    link.classList.add('active');
                }

                nav.appendChild(link);
            }
        });

        // Add notification badge if needed
        if (hasNotifications()) {
            const badge = document.createElement('span');
            badge.id = 'badge';
            badge.className = 'badge';
            badge.textContent = '!';
            nav.appendChild(badge);
        }

        updateAuthLinks(nav);
        return nav;
    }

    // Function to check for notifications
    function hasNotifications() {
        // Add your notification check logic here
        return true; // Placeholder return
    }

    // Function to initialize navigation
    function initNavigation() {
        const existingNav = document.querySelector('.nav');
        if (existingNav) {
            const newNav = createNavigation();
            existingNav.replaceWith(newNav);
        } else {
            document.body.prepend(createNavigation());
        }
    }

    // Initialize navigation
    initNavigation();
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