declare type UserMode = "student" | "teacher" | "";

declare interface UserPublicProfile {
  userId: string;
  displayName: string;
  email: string;
  photoUrl: string;
}

declare interface UserProfile extends UserPublicProfile {
  attending: string[];
  teaching: string[];
}

declare type UserProfileUpdateObject = {
  displayName?: string;
  email?: string;
  photoUrl?: string;
};

declare interface UserClass {
  className: string;
  classId: string;
}
