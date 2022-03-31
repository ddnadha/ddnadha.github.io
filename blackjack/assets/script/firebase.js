// Import the functions you need from the SDKs you need

  // import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";

  // import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-analytics.js";

  // import { database, ref, onValue } from from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js";

  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {
    apiKey: "AIzaSyBB-TWG_FUqYG_7fm9KhQ5mrogvSfobAt0",
    authDomain: "blackjack-for-uts.firebaseapp.com",
    databaseURL: "https://blackjack-for-uts-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "blackjack-for-uts",
    storageBucket: "blackjack-for-uts.appspot.com",
    messagingSenderId: "613721736648",
    appId: "1:613721736648:web:82d2514db5177ccb44ecfd",
    measurementId: "G-VNZKS0B14R"

  };


  // Initialize Firebase

  firebase.initializeApp(firebaseConfig)
  var database = firebase.database()
  
