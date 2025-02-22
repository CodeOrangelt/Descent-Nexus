document.addEventListener('DOMContentLoaded', () => {
    // Function to get relative path to root
    function getPathToRoot() {
        const path = window.location.pathname;
        const depth = path.split('/').length - 2; // -2 for leading slash and filename
        return depth > 0 ? '../'.repeat(depth) : './';
    }

    // Configuration for navigation items
    const navConfig = [
        { path: 'index.html', text: 'Nexus' },
        { path: 'https://rdl.descentnexus.com', text: 'RDL', target: '_blank' },
        { path: 'HTML/news.html', text: 'News' },
        { path: 'HTML/projectd.html', text: 'Project D' },
        { type: 'divider' },
        { path: 'HTML/login.html', text: 'Login' },
        { path: 'HTML/signup.html', text: 'Sign up' },
        { path: 'HTML/inbox.html', text: 'Notifications', class: 'nav-notification' }
    ];

    // Function to create navigation
    function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';
        const rootPath = getPathToRoot();

        // Add logo
        const logo = document.createElement('img');
        logo.src = `${rootPath}Assets/cloak.png`;
        logo.alt = 'Logo';
        logo.className = 'logo';
        nav.appendChild(logo);

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
            } else {
                const link = document.createElement('a');
                // Only modify relative paths, not absolute URLs
                link.href = item.path.startsWith('http') ? 
                    item.path : 
                    `${rootPath}${item.path}`;
                link.textContent = item.text;
                
                if (item.target) {
                    link.target = item.target;
                }
                
                if (item.class) {
                    link.className = item.class;
                }

                // Highlight current page
                if (window.location.pathname.endsWith(item.path)) {
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