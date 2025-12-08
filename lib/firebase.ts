import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
   apiKey: "AIzaSyDfy7lRDA58Py5xeCaXF7cqUN0FOx96hX0",
  authDomain: "parco-assit.firebaseapp.com",
  projectId: "parco-assit",
  storageBucket: "parco-assit.firebasestorage.app",
//   messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:167242165994:ios:8dc39b0ac5afa9fda73193",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;