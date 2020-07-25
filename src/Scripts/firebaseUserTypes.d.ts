export declare type UserMode = "student" | "teacher" | "";

export declare interface UserPublicProfile {
  userId: string;
  displayName: string;
  email: string;
  photoUrl: string;
}

export declare interface UserProfile extends UserPublicProfile {}

export declare type UserProfileUpdateObject = {
  displayName?: string;
  email?: string;
  photoUrl?: string;
};
