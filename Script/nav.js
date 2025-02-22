document.addEventListener('DOMContentLoaded', () => {
    function getPathToRoot() {
        const path = window.location.pathname;
        return path.includes('/HTML/') ? '../' : './';
    }

    const navConfig = [
        { path: './index.html', text: 'Nexus' },
        { path: 'https://rdl.descentnexus.com', text: 'RDL', target: '_blank' },
        { path: './HTML/news.html', text: 'News' },
        { path: './HTML/projectd.html', text: 'Project D' },
        { type: 'divider' },
        { id: 'authLinks', dynamic: true }
    ];

    function updateAuthLinks(nav) {
        const authLinksContainer = nav.querySelector('#authLinks');
        if (!authLinksContainer) return;

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                authLinksContainer.innerHTML = `
                    <a href="./HTML/profile.html">${user.displayName || user.email}</a>
                    <a href="#" id="signOutBtn">Sign Out</a>
                `;
                document.getElementById('signOutBtn')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    firebase.auth().signOut();
                });
            } else {
                authLinksContainer.innerHTML = `
                    <a href="#" onclick="showAuthModal(); return false;">Login</a>
                `;
            }
        });
    }

    function createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'nav';
        const rootPath = getPathToRoot();

        const title = document.createElement('h1');
        title.className = 'nav-title';
        title.textContent = 'Descent Nexus';
        nav.appendChild(title);
        nav.appendChild(document.createElement('hr'));

        navConfig.forEach(item => {
            if (item.type === 'divider') {
                nav.appendChild(document.createElement('hr'));
            } else if (item.dynamic) {
                const container = document.createElement('div');
                container.id = item.id;
                nav.appendChild(container);
            } else {
                const link = document.createElement('a');
                link.href = item.path.startsWith('http') ? 
                    item.path : 
                    `${rootPath}${item.path.replace('./', '')}`;
                link.textContent = item.text;
                
                if (item.target) link.target = item.target;
                if (item.class) link.className = item.class;

                const currentPath = window.location.pathname.split('/').pop();
                if (item.path.endsWith(currentPath)) {
                    link.classList.add('active');
                }

                nav.appendChild(link);
            }
        });

        updateAuthLinks(nav);
        return nav;
    }

    function initNavigation() {
        const existingNav = document.querySelector('.nav');
        if (existingNav) {
            existingNav.replaceWith(createNavigation());
        } else {
            document.body.prepend(createNavigation());
        }
    }

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