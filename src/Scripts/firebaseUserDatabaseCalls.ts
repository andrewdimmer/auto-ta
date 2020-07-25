import { firestoreUsersRef } from "./firebaseConfig";
import {
  UserProfile,
  UserProfileUpdateObject,
  UserPublicProfile,
} from "./firebaseUserTypes";
import { logErrReturnFalse, logErrReturnNull } from "./helpers";

/**
 * createNewUserDatabaseObjects
 * @description Creates the datebase objects for a new user after account creation.
 * @param userData The data to save to the database.
 * @returns true if there were no errors creating the database object; false otherwise.
 */
export const createNewUserDatabaseObjects = ({
  userId,
  displayName,
  email,
  photoUrl,
}: UserPublicProfile): Promise<boolean> => {
  return firestoreUsersRef
    .doc(userId)
    .set({ userId, displayName, email, photoUrl })
    .then(() => true)
    .catch(logErrReturnFalse);
};

export const getUserProfileDatabase = (
  userId: string
): Promise<UserProfile | null> => {
  return firestoreUsersRef
    .doc(userId)
    .get()
    .then((profile) => {
      const data = profile.data();
      console.log(data);
      return data ? (data as UserProfile) : null;
    })
    .catch(logErrReturnNull);
};

export const updateUserProfileDatabase = (
  userId: string,
  updateObject: UserProfileUpdateObject
): Promise<boolean> => {
  return firestoreUsersRef
    .doc(userId)
    .update(updateObject)
    .then(() => true)
    .catch(() => false);
};
