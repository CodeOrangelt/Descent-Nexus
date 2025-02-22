import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';

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

class SharedAuth {
    static async init() {
        // Initialize persistence to share across domains
        await auth.setPersistence(auth.Auth.Persistence.SESSION);
        
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
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
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

export { auth };