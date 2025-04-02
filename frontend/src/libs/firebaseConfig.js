import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARguVQtsYcOBs9xTP40QQLv2aPj1iyfyE",
  authDomain: "finance-tracker-system.firebaseapp.com",
  projectId: "finance-tracker-system",
  storageBucket: "finance-tracker-system.appspot.com",
  messagingSenderId: "109314397099",
  appId: "1:109314397099:web:83ebd3ca280c26d89bb8ee",
  measurementId: "G-H7K11PV0D6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
