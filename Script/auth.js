// Use the same Firebase config from RDL
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
firebase.initializeApp(firebaseConfig);

class SharedAuth {
    static async init() {
        // Initialize persistence to share across domains
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
        
        // Listen for token changes
        firebase.auth().onIdTokenChanged(async user => {
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
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const token = await userCredential.user.getIdToken();
            return { success: true, token };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async signOut() {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('authToken');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}