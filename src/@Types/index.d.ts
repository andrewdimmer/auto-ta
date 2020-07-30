declare type UserMode = "student" | "teacher" | "";

declare type QuestionType = "poll" | "shortAnswer" | "";

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
  handRaised: boolean;
  currentQuestion: string;
  currentQuestionType: QuestionType;
}

declare interface Question {
  questionId: string;
  type: QuestionType;
  correctAnswer: string;
  intDateStamp: number;
  answers: { [userId: string]: string };
}

declare interface CurrentQuestionAnswer {
  userId: string;
  questionId: string;
  answer: string;
}
