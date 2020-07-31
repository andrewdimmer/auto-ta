import { Button, Container, TextField, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import {
  closeFirebaseHasAnsweredQuestionListener,
  createFirebaseHasAnsweredQuestionListener,
} from "../../Scripts/firebaseCurrentQuestionsSync";
import { answerQuestion } from "../../Scripts/firebaseQuestionsDatabaseCalls";
import { raiseHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";

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

  const [shortAnswer, setShortAnswer] = React.useState<string>("");

  const handleShortAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShortAnswer(event.target.value);
  };

  if (userClass.currentQuestion) {
    createFirebaseHasAnsweredQuestionListener(
      userId,
      userClass.classId,
      userClass.currentQuestion,
      (result) => {
        setUnanswered(!result);
      }
    );
  } else {
    closeFirebaseHasAnsweredQuestionListener();
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
            <p> </p>
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
            <p> </p>
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
            <p> </p>
          </Fragment>
        ) : userClass.currentQuestionType === "shortAnswer" && unanswered ? (
          <Fragment>
            <TextField
              autoFocus
              label="Your Answer"
              fullWidth
              value={shortAnswer}
              onChange={handleShortAnswerChange}
            />
            <p> </p>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => {
                answerQuestion(
                  userId,
                  userClass.classId,
                  userClass.currentQuestion,
                  shortAnswer
                ).then(() => {
                  setShortAnswer("");
                });
              }}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Submit</Typography>
            </Button>
          </Fragment>
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
