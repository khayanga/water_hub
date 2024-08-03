// Firebaseconfiguration
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyArJE3QuyZ1I2ldcKB_BFEYF6RZDnxF8MY",
  authDomain: "waterhub-f7529.firebaseapp.com",
  projectId: "waterhub-f7529",
  storageBucket: "waterhub-f7529.appspot.com",
  messagingSenderId: "140767242851",
  appId: "1:140767242851:web:f6a96f533ad83cb8aae656",
  measurementId: "G-K2MC17PVVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const  auth = getAuth (app)

export {app, auth};