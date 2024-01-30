import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { getToken, onMessage } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCPpQUUMRkvFrZdOtBNwTvbxVeKA6N-l5Y",
  authDomain: "camera-with-ai.firebaseapp.com",
  projectId: "camera-with-ai",
  storageBucket: "camera-with-ai.appspot.com",
  messagingSenderId: "261831702951",
  appId: "1:261831702951:web:388077fecbf7e0472cde82",
  measurementId: "G-BXL7FSX0HH",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const requestForToken = async () => {
  requestPermission();
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BBh_WhzBpHQ9KYycEmPO794ZGjRkSFFwHEk-p3P8Ee9W8sSnrRDxXa23ncVyQTSLgbi5tNW1H9J3Wn_YOn_Docw",
    });
    if (currentToken) {
      console.log("current token for client: ", currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });

export const requestPermission = () => {
  console.log("request permission");
  Notification.requestPermission().then((permission) => {
    if (permission == "granted") {
      console.log("Granted");
    }
  });
};
