// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALAwPTs07RJy-DqWmpLBny0HEAn0go4yc",
  authDomain: "task2-ff10b.firebaseapp.com",
  projectId: "task2-ff10b",
  storageBucket: "task2-ff10b.firebasestorage.app",
  messagingSenderId: "152671345934",
  appId: "1:152671345934:web:3c225afe1ef7fa703fcb5f",
  measurementId: "G-7XH28KPJXE",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BA-wnjzWdbqj0WP410kZUzTYsClnkIeu3YulVdHzvyArMExeay8GljKo3d3axl9CUOxBCmSiF9Po26UOU2V2IHM",
    });

    console.log("FCM Token:", token);
    return token;
  } else {
    console.log("Notification permission denied");
  }
};
