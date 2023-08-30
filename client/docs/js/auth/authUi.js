import { googleSignIn, signOutGoogle } from './google.js';
import HomeImg from '../../images/home.svg?as=webp';

export const initAuthUi = (user) => {
  const signInButton = document.querySelector('.signin');
  const signOutButton = document.querySelector('.signout');
  const toggleDropDown = document.querySelector('.icon-wrapper');
  const image = document.querySelector('.icon');

  if (user) {
    signInButton.classList.add('hidden');
    signOutButton.classList.remove('hidden');
    image.src =
      'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg';
  } else {
    signInButton.classList.remove('hidden');
    signOutButton.classList.add('hidden');
    image.src =
      'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg';
  }

  toggleDropDown.addEventListener('click', () => {});

  signInButton.addEventListener('click', async () => {
    try {
      const res = await googleSignIn();
      return res;
    } catch (error) {
      console.error(error);
    }
  });

  signOutButton.addEventListener('click', async () => {
    try {
      const result = await signOutGoogle();
      return result;
    } catch (error) {
      console.error(error);
    }
  });
};
