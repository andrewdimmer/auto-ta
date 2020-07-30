import { firestoreClassesRef } from "./firebaseConfig";
import { processCurrentAnswersHelper } from "./firebaseQuestionsDatabaseCalls";

let firestoreListener: (() => void) | null;

export const createFirebaseQuestionListener = (
  classId: string,
  questionId: string,
  callback: (answers: { [key: string]: string }) => any
) => {
  closeFirebaseQuestionListener();
  firestoreListener = firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .onSnapshot(
      (snapshot) => {
        const results = processCurrentAnswersHelper(snapshot, questionId);
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
