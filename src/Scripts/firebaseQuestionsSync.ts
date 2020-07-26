import { firestoreClassesRef } from "./firebaseConfig";

let firestoreListener: (() => void) | null;

export const createFirebaseQuestionListener = (
  classId: string,
  questionId: string,
  callback: (answers: { [key: string]: string }) => any
) => {
  closeFirebaseQuestionListener();
  firestoreListener = firestoreClassesRef
    .doc(classId)
    .collection("questions")
    .doc(questionId)
    .collection("answers")
    .onSnapshot(
      (snapshot) => {
        const results: { [key: string]: string } = {};
        for (const doc of snapshot.docs) {
          const data = doc.data();
          if (data) {
            results[data.userId] = data.answer;
          }
        }
        callback(results);
      },
      (err) => {
        console.log(err);
      }
    );
};

export const closeFirebaseQuestionListener = () => {
  if (firestoreListener) {
    firestoreListener();
  }
  firestoreListener = null;
};
