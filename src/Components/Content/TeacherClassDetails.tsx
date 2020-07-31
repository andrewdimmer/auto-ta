import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import AudioPlayer from "react-h5-audio-player";
import {
  closeFirebaseQuestionListener,
  createFirebaseQuestionListener,
} from "../../Scripts/firebaseCurrentQuestionsSync";
import {
  closeAndCompleteQuestion,
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
  const [pollCount, setPollCount] = React.useState<{
    yes: number;
    maybe: number;
    no: number;
  }>({ yes: 0, maybe: 0, no: 0 });
  const [answerCount, setAnswerCount] = React.useState<{
    answers: number;
    users: number;
  }>({ answers: 0, users: 0 });

  const [shortAnswer, setShortAnswer] = React.useState<string>("");

  const [reportOpen, setReportOpen] = React.useState<boolean>(false);

  const handleShortAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShortAnswer(event.target.value);
  };

  const handleCloseQuestion = () => {
    if (userClass.currentQuestionType === "poll") {
      closeAndCompleteQuestion(
        userClass.classId,
        userClass.currentQuestion
      ).then(resetCountAndCloseListener);
    } else {
      closeQuestion(userClass.classId).then(resetCountAndCloseListener);
    }
  };

  const resetCountAndCloseListener = () => {
    closeFirebaseQuestionListener();
    setPollCount({ yes: 0, no: 0, maybe: 0 });
    setAnswerCount({
      answers: 0,
      users: answerCount.users,
    });
  };

  if (userClass.currentQuestion) {
    createFirebaseQuestionListener(
      userClass.classId,
      userClass.currentQuestion,
      (answers, totalNumberOfStudents) => {
        let yes = 0;
        let maybe = 0;
        let no = 0;
        let answerCountTemp = 0;
        for (const user in answers) {
          answerCountTemp++;
          if (answers[user] === "Yes") {
            yes++;
          } else if (answers[user] === "Maybe") {
            maybe++;
          } else if (answers[user] === "No") {
            no++;
          }
        }
        setPollCount({ yes, maybe, no });
        setAnswerCount({
          answers: answerCountTemp,
          users: totalNumberOfStudents,
        });
        // Close short answers once all answers are in
        if (
          userClass.currentQuestionType === "shortAnswer" &&
          totalNumberOfStudents > 0 &&
          totalNumberOfStudents === answerCountTemp
        ) {
          handleCloseQuestion();
          setNotification({
            type: "info",
            message: "All students have answered!",
            open: true,
          });
        }
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
            <p> </p>
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
              <p> </p>
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
              <strong>{answerCount.answers}</strong> out of{" "}
              <strong>{answerCount.users}</strong> students have answered.
              <br />
              <br />
              {userClass.currentQuestionType === "poll" && (
                <Fragment>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Box style={{ width: 85, textAlign: "left" }}>
                        <strong>Yes: </strong>
                        {pollCount.yes}
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <LinearProgress
                        variant="determinate"
                        value={
                          answerCount.users > 0
                            ? (pollCount.yes * 100) / answerCount.users
                            : 0
                        }
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container alignItems="center">
                    <Grid item>
                      <Box style={{ width: 85, textAlign: "left" }}>
                        <strong>Maybe: </strong>
                        {pollCount.maybe}
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <LinearProgress
                        variant="determinate"
                        value={
                          answerCount.users > 0
                            ? (pollCount.maybe * 100) / answerCount.users
                            : 0
                        }
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Grid container alignItems="center">
                    <Grid item>
                      <Box style={{ width: 85, textAlign: "left" }}>
                        <strong>No: </strong>
                        {pollCount.no}
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <LinearProgress
                        variant="determinate"
                        value={
                          answerCount.users > 0
                            ? (pollCount.no * 100) / answerCount.users
                            : 0
                        }
                      />
                    </Grid>
                  </Grid>
                  <br />
                </Fragment>
              )}
              <Button
                color="primary"
                variant="contained"
                fullWidth
                onClick={handleCloseQuestion}
                className={classes.marginedTopBottom}
              >
                <Typography variant="h5">
                  Close{" "}
                  {userClass.currentQuestionType === "poll"
                    ? "Poll"
                    : "Question"}
                </Typography>
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
            <p> </p>
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
            <p> </p>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => setReportOpen(true)}
              className={classes.marginedTopBottom}
            >
              <Typography variant="h5">View Report</Typography>
            </Button>
            <p> </p>
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
