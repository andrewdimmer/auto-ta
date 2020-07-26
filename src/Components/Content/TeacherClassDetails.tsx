import { Button, Container, Typography, TextField } from "@material-ui/core";
import React, { Fragment } from "react";
import AudioPlayer from "react-h5-audio-player";
import {
  closeQuestion,
  createNewQuestion,
  markQuestionComplete,
} from "../../Scripts/firebaseQuestionsDatabaseCalls";
import {
  closeFirebaseQuestionListener,
  createFirebaseQuestionListener,
} from "../../Scripts/firebaseQuestionsSync";
import { ackRaisedHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";

declare interface TeacherClassDetailsProps {
  userClass: UserClass;
  classes: any;
}

const TeacherClassDetails: React.FunctionComponent<TeacherClassDetailsProps> = ({
  userClass,
  classes,
}) => {
  const [yesCount, setYesCount] = React.useState<number>(0);
  const [noCount, setNoCount] = React.useState<number>(0);
  const [maybeCount, setMaybeCount] = React.useState<number>(0);

  const [shortAnswer, setShortAnswer] = React.useState<string>("");

  const handleShortAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShortAnswer(event.target.value);
  };

  if (userClass.currentQuestion && userClass.currentQuestionType === "poll") {
    createFirebaseQuestionListener(
      userClass.classId,
      userClass.currentQuestion,
      (answers) => {
        let yesCountTemp = 0;
        let noCountTemp = 0;
        let maybeCountTemp = 0;
        for (const user in answers) {
          if (answers[user].indexOf("Yes") === 0) {
            yesCountTemp++;
          }
          if (answers[user].indexOf("No") === 0) {
            noCountTemp++;
          }
          if (answers[user].indexOf("Maybe") === 0) {
            maybeCountTemp++;
          }
        }
        setYesCount(yesCountTemp);
        setNoCount(noCountTemp);
        setMaybeCount(maybeCountTemp);
      }
    );
  } else {
    closeFirebaseQuestionListener();
  }

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        {userClass.handRaised && (
          <Fragment>
            <AudioPlayer
              src="/assets/ding3.wav"
              autoPlay={true}
              style={{ display: "none" }}
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => ackRaisedHand(userClass.classId)}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Acknowledge Raised Hand</Typography>
            </Button>
          </Fragment>
        )}
        {userClass.currentQuestion ? (
          !userClass.currentQuestionType ? (
            <Fragment>
              <TextField
                autoFocus
                label="Correct Answer"
                fullWidth
                value={shortAnswer}
                onChange={handleShortAnswerChange}
              />
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  markQuestionComplete(
                    userClass.classId,
                    userClass.currentQuestion,
                    shortAnswer
                  );
                  setShortAnswer("");
                }}
                className={classes.marginedTopBottom}
              >
                <Typography variant="h5">Submit</Typography>
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Typography variant="h5">Awaiting Results...</Typography>
              {userClass.currentQuestionType === "poll" && (
                <Fragment>
                  <strong>Yes: </strong>
                  {yesCount}
                  <br />
                  <strong>No: </strong>
                  {noCount}
                  <br />
                  <strong>Maybe: </strong>
                  {maybeCount}
                </Fragment>
              )}
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={() => {
                  closeQuestion(userClass.classId);
                  if (userClass.currentQuestionType === "poll") {
                    markQuestionComplete(
                      userClass.classId,
                      userClass.currentQuestion,
                      ""
                    );
                  }
                }}
                className={classes.marginedTopBottom}
              >
                <Typography variant="h5">Close Question</Typography>
              </Button>
            </Fragment>
          )
        ) : (
          <Fragment>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => createNewQuestion(userClass.classId, "poll")}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Start Yes/No/Maybe Poll</Typography>
            </Button>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() =>
                createNewQuestion(userClass.classId, "shortAnswer")
              }
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">Start Short Answer Question</Typography>
            </Button>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
};

export default TeacherClassDetails;
