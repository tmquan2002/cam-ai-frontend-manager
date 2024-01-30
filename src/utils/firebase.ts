import firebase from "firebase/app";
import "firebase/messaging";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCPpQUUMRkvFrZdOtBNwTvbxVeKA6N-l5Y",
    authDomain: "camera-with-ai.firebaseapp.com",
    projectId: "camera-with-ai",
    storageBucket: "camera-with-ai.appspot.com",
    messagingSenderId: "261831702951",
    appId: "1:261831702951:web:388077fecbf7e0472cde82",
    measurementId: "G-BXL7FSX0HH",
  });
} else {
  firebase.app(); // if already initialized, use that one
}

let messaging: firebase.messaging.Messaging;

if (typeof window !== "undefined") {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
}

export const getMessagingToken = async () => {
  let currentToken = "";
  if (!messaging) return;
  try {
    currentToken = await messaging.getToken({
      vapidKey:
        "BBh_WhzBpHQ9KYycEmPO794ZGjRkSFFwHEk-p3P8Ee9W8sSnrRDxXa23ncVyQTSLgbi5tNW1H9J3Wn_YOn_Docw",
    });
    console.log("FCM registration token", currentToken);
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
