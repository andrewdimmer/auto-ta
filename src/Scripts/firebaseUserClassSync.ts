import { firestoreClassesRef } from "./firebaseConfig";

let firestoreListener: (() => void) | null;

export const createFirebaseClassListener = (
  classId: string,
  callback: (userClass: UserClass) => any
) => {
  closeFirebaseClassListener();
  firestoreListener = firestoreClassesRef.doc(classId).onSnapshot(
    (snapshot) => {
      const data = snapshot.data();
      if (data) {
        callback(snapshot.data() as UserClass);
      } else {
        console.log("No data returned from snapshot.");
      }
    },
    (err) => {
      console.log(err);
    }
  );
};

export const closeFirebaseClassListener = () => {
  if (firestoreListener) {
    firestoreListener();
  }
  firestoreListener = null;
};
