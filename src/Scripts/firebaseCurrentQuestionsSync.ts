import { firestoreClassesRef } from "./firebaseConfig";
import { processCurrentAnswersHelper } from "./firebaseQuestionsDatabaseCalls";

let firestoreListenerAllAnswers: (() => void) | null;
let firestoreListenerSingleUser: (() => void) | null;

export const createFirebaseQuestionListener = (
  classId: string,
  questionId: string,
  callback: (answers: { [key: string]: string }, totalStudent: number) => any
) => {
  closeFirebaseQuestionListener();
  firestoreListenerAllAnswers = firestoreClassesRef
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
  if (firestoreListenerAllAnswers) {
    firestoreListenerAllAnswers();
  }
  firestoreListenerAllAnswers = null;
};

export const createFirebaseHasAnsweredQuestionListener = (
  userId: string,
  classId: string,
  questionId: string,
  callback: (answeredQuestion: boolean) => any
) => {
  closeFirebaseHasAnsweredQuestionListener();
  firestoreListenerSingleUser = firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .doc(userId)
    .onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        callback(data ? data.questionId === questionId : false);
      },
      (err) => {
        console.log(err);
      }
    );
};

export const closeFirebaseHasAnsweredQuestionListener = () => {
  if (firestoreListenerSingleUser) {
    firestoreListenerSingleUser();
  }
  firestoreListenerSingleUser = null;
};
