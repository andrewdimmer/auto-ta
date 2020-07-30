import { firestoreClassesRef, firestoreUsersRef } from "./firebaseConfig";
import { logErrReturn } from "./helpers";

export const getReportData = (classId: string) => {
  return Promise.all([
    getStudentsInClass(classId),
    getQuestionsInClass(classId),
  ])
    .then((results) => {
      return { students: results[0], questions: results[1] };
    })
    .catch(logErrReturn(null));
};

const getStudentsInClass = (classId: string) => {
  return firestoreUsersRef
    .where("attending", "array-contains", classId)
    .orderBy("displayName", "asc")
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.reduce((users, doc) => {
        const data = doc.data();
        users.push(data as UserPublicProfile);
        return users;
      }, [] as UserPublicProfile[]);
    })
    .catch(logErrReturn([] as UserPublicProfile[]));
};

const getQuestionsInClass = (classId: string) => {
  return firestoreClassesRef
    .doc(classId)
    .collection("questions")
    .orderBy("intDateStamp", "asc")
    .get()
    .then((querySnapshot) => {
      return querySnapshot.docs.reduce((users, doc) => {
        const data = doc.data();
        users.push(data as Question);
        return users;
      }, [] as Question[]);
    })
    .catch(logErrReturn([] as Question[]));
};
