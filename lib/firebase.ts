import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxUkivCM_dPwWxyNt2rJbhtVQEA7hnR6g",
  authDomain: "goodgoodstudy-a5615.firebaseapp.com",
  projectId: "goodgoodstudy-a5615",
  storageBucket: "goodgoodstudy-a5615.firebasestorage.app",
  messagingSenderId: "136984350642",
  appId: "1:136984350642:web:7a56a2ce016a5ee27ddeab"
};

const app = initializeApp(firebaseConfig);

// 只导出“工具”，不导出 app 本身
export const auth = getAuth(app);
export const db = getFirestore(app);
