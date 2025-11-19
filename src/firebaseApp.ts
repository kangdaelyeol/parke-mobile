// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBkSVx5WRDi3NTRIpE1oqu5qVH_-N2eGmE',
  authDomain: 'parke-42fac.firebaseapp.com',
  databaseURL: 'https://parke-42fac-default-rtdb.firebaseio.com',
  projectId: 'parke-42fac',
  storageBucket: 'parke-42fac.firebasestorage.app',
  messagingSenderId: '1092969773825',
  appId: '1:1092969773825:web:3b68b22411966ecd843900',
  measurementId: 'G-RHZHM9BVZ4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
