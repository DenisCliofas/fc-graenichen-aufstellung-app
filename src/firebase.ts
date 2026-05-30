import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBn6B3tA6XCWhzml0tHg-R90zU-W4gRF-A",
  authDomain: "fc-graenichen-aufstellung-app.firebaseapp.com",
  projectId: "fc-graenichen-aufstellung-app",
  storageBucket: "fc-graenichen-aufstellung-app.firebasestorage.app",
  messagingSenderId: "670289726275",
  appId: "1:670289726275:web:50d913a72915833dd9bdf6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
