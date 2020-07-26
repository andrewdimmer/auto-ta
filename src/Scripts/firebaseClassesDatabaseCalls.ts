import { firestoreClassesRef, firestoreUsersRef } from "./firebaseConfig";
import { logErrReturnFalse, logErrReturnNull } from "./helpers";

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
    .catch(logErrReturnNull);
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
        .catch(logErrReturnFalse);
    })
    .catch(logErrReturnFalse);
};

export const joinNewClass = (userId: string, userClasses: string[]) => {
  return firestoreUsersRef
    .doc(userId)
    .update({ attending: userClasses })
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
        .catch(logErrReturnNull);
    })
    .catch(logErrReturnNull);
};
