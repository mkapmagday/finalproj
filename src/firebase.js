import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBcLZFYTwow1JTH8kzjj8QkjAp_UWvmnUk',
  authDomain: 'integproj-8a40b.firebaseapp.com',
  projectId: 'integproj-8a40b',
  storageBucket: 'integproj-8a40b.appspot.com',
  messagingSenderId: '1086389286054',
  appId: '1:1086389286054:web:42e0ec6c19ed2503457067',
  measurementId: 'G-0XSZ5139LL'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export{
    db,auth
}