import { Button, Container, TextField, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import AudioPlayer from "react-h5-audio-player";
import {
  closeFirebaseQuestionListener,
  createFirebaseQuestionListener,
} from "../../Scripts/firebaseCurrentQuestionsSync";
import {
  closeQuestion,
  createNewQuestion,
  markQuestionComplete,
} from "../../Scripts/firebaseQuestionsDatabaseCalls";
import { ackRaisedHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";
import ReportView from "../Layouts/ReportView";
import { NotificationMessage } from "../Misc/Notifications";

declare interface TeacherClassDetailsProps {
  userClass: UserClass;
  setLoadingMessage: (message: string) => void;
  setNotification: (notification: NotificationMessage) => void;
  classes: any;
}

const TeacherClassDetails: React.FunctionComponent<TeacherClassDetailsProps> = ({
  userClass,
  setLoadingMessage,
  setNotification,
  classes,
}) => {
  const [yesCount, setYesCount] = React.useState<number>(0);
  const [noCount, setNoCount] = React.useState<number>(0);
  const [maybeCount, setMaybeCount] = React.useState<number>(0);

  const [shortAnswer, setShortAnswer] = React.useState<string>("");

  const [reportOpen, setReportOpen] = React.useState<boolean>(false);

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
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => setReportOpen(true)}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">View Report</Typography>
            </Button>
          </Fragment>
        )}
      </Container>

      <ReportView
        open={reportOpen}
        setOpen={setReportOpen}
        userClass={userClass}
        setLoadingMessage={setLoadingMessage}
        setNotification={setNotification}
        classes={classes}
      />
    </Fragment>
  );
};

export default TeacherClassDetails;
