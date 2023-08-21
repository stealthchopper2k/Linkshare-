import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
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
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // in case we want to use any google services
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      try {
        const idToken = await auth.currentUser.getIdToken();
        const res = await fetch(
          'https://europe-west2-linkshares.cloudfunctions.net/getuserfiles',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          return { data, user };
        } else {
          console.log('Error', res.status);
        }
      } catch (e) {
        console.log(e, 'Error with getting User File');
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
      return { errorCode, errorMessage, email, credential };
      // ...
    });
}

export function signOutGoogle() {
  return signOut(auth)
    .then(() => {
      console.log('signed out');
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
}
