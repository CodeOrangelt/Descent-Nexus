document.addEventListener('DOMContentLoaded', () => {
    const newsModal = document.getElementById('newsModal');
    const newsCloseBtn = document.querySelector('.news-close');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to show news modal
    function showNewsModal() {
        console.log('Showing news modal'); // Debug log
        if (newsModal) {
            newsModal.style.display = 'block';
            newsModal.style.opacity = '400';
            newsModal.style.zIndex = '1000';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            console.error('News modal not found');
        }
    }

    // Function to close news modal
    function closeNewsModal() {
        console.log('Closing news modal'); // Debug log
        if (newsModal) {
            newsModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Close modal when clicking the X button
    if (newsCloseBtn) {
        newsCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeNewsModal();
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === newsModal) {
            closeNewsModal();
        }
    });

    // Tab switching functionality
    function switchTab(targetTab) {
        console.log('Switching to tab:', targetTab); // Debug log
        
        // Remove active class from all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        const clickedButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetContent = document.getElementById(targetTab);
        
        if (clickedButton && targetContent) {
            clickedButton.classList.add('active');
            targetContent.classList.add('active');
        } else {
            console.error('Tab elements not found:', targetTab);
        }
    }

    // Add click events to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Export function to be used by nav.js
    window.showNewsModal = showNewsModal;
    
    // Also export to global scope for debugging
    window.debugNewsModal = {
        show: showNewsModal,
        close: closeNewsModal,
        element: newsModal
    };
});