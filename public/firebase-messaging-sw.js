// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: "AIzaSyCPpQUUMRkvFrZdOtBNwTvbxVeKA6N-l5Y",
  authDomain: "camera-with-ai.firebaseapp.com",
  projectId: "camera-with-ai",
  storageBucket: "camera-with-ai.appspot.com",
  messagingSenderId: "261831702951",
  appId: "1:261831702951:web:388077fecbf7e0472cde82",
  measurementId: "G-BXL7FSX0HH",
});

// eslint-disable-next-line no-undef, @typescript-eslint/no-unused-vars
const messaging = firebase.messaging();
