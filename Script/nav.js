document.addEventListener('DOMContentLoaded', () => {
    // Configuration for navigation items
    const navConfig = [
        { path: '/index.html', text: 'Nexus' },
        { path: 'https://rdl.descentnexus.com', text: 'RDL', target: '_blank' },
        { path: '/HTML/news.html', text: 'News' },
        { path: '#', text: 'Project D' },
        { type: 'divider' },
        { path: '/HTML/login.html', text: 'Login' },
        { path: '/HTML/signup.html', text: 'Sign up' },
        { path: '/HTML/inbox.html', text: 'Notifications', class: 'nav-notification' }
    ];

    // Function to create navigation
    function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';

        // Add title
        const title = document.createElement('h1');
        title.className = 'nav-title';
        title.textContent = 'Descent Nexus';
        nav.appendChild(title);

        // Add first divider
        nav.appendChild(document.createElement('hr'));

        // Create navigation items
        navConfig.forEach(item => {
            if (item.type === 'divider') {
                nav.appendChild(document.createElement('hr'));
            } else {
                const link = document.createElement('a');
                link.href = item.path;
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