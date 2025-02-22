import { auth, signInWithEmailAndPassword } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    function closeModal() {
        modal.style.display = 'none';
        loginError.textContent = '';
    }

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            closeModal();
            console.log('Logged in:', userCredential.user);
            
            // Update navigation to show logged-in state
            const loginLink = document.querySelector('.login-link');
            if (loginLink) {
                loginLink.textContent = userCredential.user.email;
                loginLink.classList.add('logged-in');
            }
        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        const loginLink = document.querySelector('.login-link');
        if (user && loginLink) {
            loginLink.textContent = user.email;
            loginLink.classList.add('logged-in');
        }
    });
});