import { firestoreClassesRef, firestoreUsersRef } from "./firebaseConfig";
import { logErrReturn } from "./helpers";

export const getUserClasses = (userClasses: string[]) => {
  const userClassPromises = userClasses.map(getUserClass);

  return Promise.all(userClassPromises).then((userClasses) => {
    return userClasses.reduce((cleanUserClasses, classData) => {
      if (classData) {
        cleanUserClasses.push(classData);
      }
      return cleanUserClasses;
    }, [] as UserClass[]);
  });
};

export const getUserClass = (classId: string) => {
  return firestoreClassesRef
    .doc(classId)
    .get()
    .then((classData) => {
      const data = classData.data();
      if (data) {
        return data as UserClass;
      } else {
        console.log(`No data returned for class ${classId}`);
        return null;
      }
    })
    .catch(logErrReturn(null));
};

export const createNewClass = (
  userId: string,
  userClasses: string[],
  classObject: UserClass
) => {
  return firestoreUsersRef
    .doc(userId)
    .update({ teaching: userClasses })
    .then(() => {
      return firestoreClassesRef
        .doc(classObject.classId)
        .set(classObject)
        .then(() => true)
        .catch(logErrReturn(false));
    })
    .catch(logErrReturn(false));
};

export const joinNewClass = (userId: string, userClasses: string[]) => {
  return firestoreUsersRef
    .doc(userId)
    .update({ attending: userClasses })
    .then(() => {
      return firestoreClassesRef
        .doc(userClasses[userClasses.length - 1])
        .collection("currentQuestionAnswers")
        .doc(userId)
        .set({ userId, questionId: "", answer: "" })
        .then(() => {
          return firestoreClassesRef
            .doc(userClasses[userClasses.length - 1])
            .get()
            .then((classDoc) => {
              const data = classDoc.data();
              if (data) {
                return data as UserClass;
              }
              console.log("No data returned for that class");
              return null;
            })
            .catch(logErrReturn(null));
        })
        .catch(logErrReturn(null));
    })
    .catch(logErrReturn(null));
};
