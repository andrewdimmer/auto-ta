import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { raiseHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";
import {
  closeFirebaseQuestionListener,
  createFirebaseQuestionListener,
} from "../../Scripts/firebaseQuestionsSync";
import { answerQuestion } from "../../Scripts/firebaseQuestionsDatabaseCalls";

declare interface StudentClassDetailsProps {
  userId: string;
  userClass: UserClass;
  classes: any;
}

const StudentClassDetails: React.FunctionComponent<StudentClassDetailsProps> = ({
  userId,
  userClass,
  classes,
}) => {
  const [unanswered, setUnanswered] = React.useState<boolean>(false);

  if (userClass.currentQuestion) {
    createFirebaseQuestionListener(
      userClass.classId,
      userClass.currentQuestion,
      (answers) => {
        console.log("userId: " + userId);
        for (const answerUserId in answers) {
          console.log("answerUserId:" + answerUserId);
          if (
            answerUserId.indexOf(userId) === 0 &&
            userId.indexOf(answerUserId) === 0
          ) {
            setUnanswered(false);
            console.log("Answered");
            return;
          }
        }
        console.log("Unanswered");
        setUnanswered(true);
      }
    );
  } else {
    closeFirebaseQuestionListener();
  }

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        {userClass.currentQuestionType === "poll" && unanswered ? (
          <Fragment>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => {
                answerQuestion(
                  userId,
                  userClass.classId,
                  userClass.currentQuestion,
                  "Yes"
                );
              }}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Yes</Typography>
            </Button>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => {
                answerQuestion(
                  userId,
                  userClass.classId,
                  userClass.currentQuestion,
                  "No"
                );
              }}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">No</Typography>
            </Button>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => {
                answerQuestion(
                  userId,
                  userClass.classId,
                  userClass.currentQuestion,
                  "Maybe"
                );
              }}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Maybe</Typography>
            </Button>
          </Fragment>
        ) : userClass.currentQuestionType === "shortAnswer" && unanswered ? (
          <Fragment></Fragment>
        ) : (
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => raiseHand(userClass.classId)}
            className={classes.marginedTopBottom}
          >
            <Typography variant="h5">Raise Hand</Typography>
          </Button>
        )}
      </Container>
    </Fragment>
  );
};

export default StudentClassDetails;
