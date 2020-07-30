import { nanoid } from "nanoid";
import { firestoreClassesRef } from "./firebaseConfig";
import { logErrReturnEmptyObject, logErrReturnFalse } from "./helpers";

export const createNewQuestion = (classId: string, type: QuestionType) => {
  const questionId = nanoid();
  return firestoreClassesRef
    .doc(classId)
    .collection("questions")
    .doc(questionId)
    .set({
      questionId,
      type,
      answers: {},
      correctAnswer: "",
      intDateStamp: Date.now(),
    })
    .then(() => {
      return firestoreClassesRef
        .doc(classId)
        .update({ currentQuestion: questionId, currentQuestionType: type })
        .then(() => true)
        .catch(logErrReturnFalse);
    })
    .catch(logErrReturnFalse);
};

export const closeQuestion = (classId: string) => {
  return firestoreClassesRef
    .doc(classId)
    .update({ currentQuestionType: "" })
    .then(() => true)
    .catch(logErrReturnFalse);
};

export const markQuestionComplete = (
  classId: string,
  questionId: string,
  correctAnswer: string
) => {
  return firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .get()
    .then((snapshot) => {
      const answers = processCurrentAnswersHelper(snapshot, questionId);
      return firestoreClassesRef
        .doc(classId)
        .collection("questions")
        .doc(questionId)
        .update({ correctAnswer, answers })
        .then(() => {
          return firestoreClassesRef
            .doc(classId)
            .update({ currentQuestion: "" })
            .then(() => true)
            .catch(logErrReturnFalse);
        })
        .catch(logErrReturnFalse);
    })
    .catch(logErrReturnEmptyObject);
};

export const answerQuestion = (
  userId: string,
  classId: string,
  questionId: string,
  answer: string
) => {
  return firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .doc(userId)
    .set({ userId, questionId, answer })
    .then(() => true)
    .catch(logErrReturnFalse);
};

export const processCurrentAnswersHelper = (
  snapshot: firebase.firestore.QuerySnapshot,
  currentQuestionId: string
) => {
  return snapshot.docs.reduce((results, doc) => {
    const data = doc.data();
    if (data && data["questionId"] === currentQuestionId) {
      results[data.userId] = data.answer;
    }
    return results;
  }, {} as { [userId: string]: string });
};

export const getCurrentQuestionAnswers = (
  classId: string,
  questionId: string
) => {
  return firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .get()
    .then((snapshot) => {
      return processCurrentAnswersHelper(snapshot, questionId);
    })
    .catch(logErrReturnEmptyObject);
};
