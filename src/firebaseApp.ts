import { getApp } from '@react-native-firebase/app';
// Import the functions you need from the SDKs you need
import { getDatabase } from '@react-native-firebase/database';

// Initialize Firebase
export const firebaseApp = getApp();
export const db = getDatabase();
