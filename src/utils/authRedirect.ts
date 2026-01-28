import { router } from 'expo-router';

export const redirectToLogin = () => {
  router.replace('/login');
};

export const redirectToHome = () => {
  router.replace('/home');
};
