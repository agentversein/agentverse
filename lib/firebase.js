import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaCW5EBfamTnLHc-p0YyXYCU_FpBLO7T0",
  authDomain: "agentverse-2bd2c.firebaseapp.com",
  projectId: "agentverse-2bd2c",
  storageBucket: "agentverse-2bd2c.firebasestorage.app",
  messagingSenderId: "533714522059",
  appId: "1:533714522059:web:efc28627ade97f3a7c304e",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);