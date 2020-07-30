import { firestoreClassesRef } from "./firebaseConfig";
import { processCurrentAnswersHelper } from "./firebaseQuestionsDatabaseCalls";

let firestoreListener: (() => void) | null;

export const createFirebaseQuestionListener = (
  classId: string,
  questionId: string,
  callback: (answers: { [key: string]: string }, totalStudent: number) => any
) => {
  closeFirebaseQuestionListener();
  firestoreListener = firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .onSnapshot(
      (snapshot) => {
        const results = processCurrentAnswersHelper(snapshot, questionId);
        callback(results, snapshot.docs.length);
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
