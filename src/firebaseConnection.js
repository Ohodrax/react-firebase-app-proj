import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDiNSQ9Xr7IQrZqCO6yMDT5C5Rdh8JCQEQ",
  authDomain: "curso-d9926.firebaseapp.com",
  projectId: "curso-d9926",
  storageBucket: "curso-d9926.appspot.com",
  messagingSenderId: "696300754871",
  appId: "1:696300754871:web:5f85f27284e51b359efa32",
  measurementId: "G-DRPXTGL15T"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth };