import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut,
    browserLocalPersistence,
    setPersistence 
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';

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
const db = getFirestore(app);

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

// Add function to get username
async function getUserName(uid) {
    try {
        const userDoc = await getDoc(doc(db, 'players', uid));
        if (userDoc.exists()) {
            return userDoc.data().pilotName || 'Unknown Pilot';
        }
        return 'Unknown Pilot';
    } catch (error) {
        console.error('Error fetching username:', error);
        return 'Unknown Pilot';
    }
}

export { auth, signInWithEmailAndPassword, signOut, getUserName };

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');

    function closeModal() {
        modal.style.display = 'none';
        loginError.textContent = '';
    }

    // Close button click
    closeBtn?.addEventListener('click', closeModal);

    // Click outside modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Add click handler for login button
    loginButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            loginButton.disabled = true; // Prevent double-clicks
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in:', userCredential.user);
            closeModal();
            location.reload(); // Refresh to update UI
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = error.message;
        } finally {
            loginButton.disabled = false;
        }
    });
});

// Function to show modal
export function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}