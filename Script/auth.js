import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut,
    browserLocalPersistence,
    setPersistence 
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyDMF-bq4tpLoZvUYep_G-igmHbK2h-e-Zs",
    authDomain: "rdladder.firebaseapp.com",
    projectId: "rdladder",
    storageBucket: "rdladder.firebasestorage.app",
    messagingSenderId: "152922774046",
    appId: "1:152922774046:web:c14bd25f07ad1aa0366c0f",
    measurementId: "G-MXVPNC0TVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize cross-domain persistence
setPersistence(auth, browserLocalPersistence);

class SharedAuth {
    static async init() {
        // Initialize persistence to share across domains
        await setPersistence(auth, browserLocalPersistence);
        
        // Listen for token changes
        auth.onIdTokenChanged(async user => {
            if (user) {
                const token = await user.getIdToken();
                // Store token in localStorage to share between domains
                localStorage.setItem('authToken', token);
            } else {
                localStorage.removeItem('authToken');
            }
        });
    }

    static async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            return { success: true, token };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async signOut() {
        try {
            await auth.signOut();
            localStorage.removeItem('authToken');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export { auth, signInWithEmailAndPassword, signOut };

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Close modal function
    function closeModal() {
        modal.style.display = 'none';
        loginError.textContent = '';
    }

    // Close button click
    closeBtn.addEventListener('click', closeModal);

    // Click outside modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            closeModal();
            console.log('Logged in:', userCredential.user);
            // Refresh the page to update UI
            location.reload();
        } catch (error) {
            loginError.textContent = error.message;
            console.error('Login error:', error);
        }
    });
});

// Function to show modal
export function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}