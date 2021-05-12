import firebase from 'firebase';

/**
 * Connection of Firebase from client to database
 */

const firebaseConfig = {
    apiKey: "AIzaSyD3MiaLOoFCxaSTA5l8bEjM4akyfE6U6y8",
    authDomain: "connect-b3668.firebaseapp.com",
    projectId: "connect-b3668",
    storageBucket: "connect-b3668.appspot.com",
    messagingSenderId: "360221709634",
    appId: "1:360221709634:web:09a3ad2a66ec6c22aca4db",
    measurementId: "G-4X4RGZX5Q1"
};
  
// Initialization of App for 1st time if not initialized on the first place
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Access to database
const db = app.firestore();

// Access to authentication
const auth = app.auth();

// Access to the provider Google
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };

