import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBmCBpKEm11K7DTeNDAZKUrJ6OIrHtH5Qo",
  authDomain: "euberus-asia.firebaseapp.com",
  databaseURL: "https://euberus-asia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "euberus-asia",
  storageBucket: "euberus-asia.firebasestorage.app",
 
  appId: "1:766932876232:web:2a86363c68540944d35efd"
  
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);