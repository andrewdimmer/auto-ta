import { nanoid } from "nanoid";
import { firestoreClassesRef } from "./firebaseConfig";
import { logErrReturn } from "./helpers";

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
        .catch(logErrReturn(false));
    })
    .catch(logErrReturn(false));
};

export const closeQuestion = (classId: string) => {
  return firestoreClassesRef
    .doc(classId)
    .update({ currentQuestionType: "" })
    .then(() => true)
    .catch(logErrReturn(false));
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
            .catch(logErrReturn(false));
        })
        .catch(logErrReturn(false));
    })
    .catch(logErrReturn(false));
};

export const closeAndCompleteQuestion = (
  classId: string,
  questionId: string,
  correctAnswer: string = ""
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
            .update({ currentQuestionType: "", currentQuestion: "" })
            .then(() => true)
            .catch(logErrReturn(false));
        })
        .catch(logErrReturn(false));
    })
    .catch(logErrReturn(false));
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
    .catch(logErrReturn(false));
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
): Promise<{ [userId: string]: string }> => {
  return firestoreClassesRef
    .doc(classId)
    .collection("currentQuestionAnswers")
    .get()
    .then((snapshot) => {
      return processCurrentAnswersHelper(snapshot, questionId);
    })
    .catch(logErrReturn({}));
};
