import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA1XQhV1xaaM0zfGw_RrMv6r5VzKfOT_Rs',
  authDomain: 'linkshares.firebaseapp.com',
  projectId: 'linkshares',
  storageBucket: 'linkshares.appspot.com',
  messagingSenderId: '25036597944',
  appId: '1:25036597944:web:6b928a495685c821a9e24d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
export const auth = getAuth();

// this is used to get the owners google api token to use for getting their email list in Share input
export function googleSignIn() {
  return signInWithPopup(auth, provider)
    .then(async (result) => {
      provider.setCustomParameters({ prompt: 'select_account' });
      const user = result.user;
      return { success: true, user: user };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { success: false, code: errorMessage, message: errorCode };
    });
}

export async function signOutGoogle() {
  await signOut(auth)
    .then(() => {
      console.log('signed out');
    })
    .catch((error) => {
      console.log(error);
    });
}
export function signUpForm(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return { success: true, message: 'Email sent' };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { success: false, code: errorMessage, message: errorCode };
    });
}

export function verifyEmail() {
  return sendEmailVerification(auth.currentUser)
    .then(() => {
      return { success: true, message: 'Email sent' };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { success: false, code: errorMessage, message: errorCode };
    });
}

export function signInForm(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return { success: true, message: 'Email sent' };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { success: false, code: errorMessage, message: errorCode };
    });
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('success');
      return { success: true, message: 'Email sent' };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { success: false, code: errorMessage, message: errorCode };
    });
}
