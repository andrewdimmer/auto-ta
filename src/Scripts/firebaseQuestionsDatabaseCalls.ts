import { nanoid } from "nanoid";
import { firestoreClassesRef } from "./firebaseConfig";
import { logErrReturnFalse } from "./helpers";

export const createNewQuestion = (classId: string, type: QuestionType) => {
  const questionId = nanoid();
  return firestoreClassesRef
    .doc(classId)
    .collection("questions")
    .doc(questionId)
    .set({ questionId, type, answers: {}, correctAnswer: "" })
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
    .collection("questions")
    .doc(questionId)
    .update({ correctAnswer })
    .then(() => {
      return firestoreClassesRef
        .doc(classId)
        .update({ currentQuestion: "" })
        .then(() => true)
        .catch(logErrReturnFalse);
    })
    .catch(logErrReturnFalse);
};

export const answerQuestion = (
  userId: string,
  classId: string,
  questionId: string,
  answer: string
) => {
  return firestoreClassesRef
    .doc(classId)
    .collection("questions")
    .doc(questionId)
    .collection("answers")
    .doc(userId)
    .set({ userId, answer })
    .then(() => true)
    .catch(logErrReturnFalse);
};
