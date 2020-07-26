import { firestoreClassesRef } from "./firebaseConfig";

export const raiseHand = (classId: string) => {
  firestoreClassesRef.doc(classId).update({ handRaised: true });
};

export const ackRaisedHand = (classId: string) => {
  firestoreClassesRef.doc(classId).update({ handRaised: false });
};
