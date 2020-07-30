import { firebaseApp } from "./firebaseConfig";

let firebaseAuthListener: (() => void) | null;

export const createFirebaseAuthListener = (
  callback: (user: firebase.User | null) => any
) => {
  closeFirebaseAuthListener();
  firebaseAuthListener = firebaseApp.auth().onAuthStateChanged((user) => {
    callback(user);
  });
};

export const closeFirebaseAuthListener = () => {
  if (firebaseAuthListener) {
    firebaseAuthListener();
  }
  firebaseAuthListener = null;
};
