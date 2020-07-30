import { Button, Container, TextField, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import {
  answerQuestion,
  userHasAnsweredQuestion,
} from "../../Scripts/firebaseQuestionsDatabaseCalls";
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
    userHasAnsweredQuestion(
      userId,
      userClass.classId,
      userClass.currentQuestion
    ).then((result) => {
      setUnanswered(!result);
    });
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
                ).then(() => {
                  setUnanswered(false);
                });
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
                ).then(() => {
                  setUnanswered(false);
                });
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
                ).then(() => {
                  setUnanswered(false);
                });
              }}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Maybe</Typography>
            </Button>
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
                  setUnanswered(false);
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
