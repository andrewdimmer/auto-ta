import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import AudioPlayer from "react-h5-audio-player";
import {
  closeQuestion,
  createNewQuestion,
  markQuestionComplete,
} from "../../Scripts/firebaseQuestionsDatabaseCalls";
import { ackRaisedHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";

declare interface TeacherClassDetailsProps {
  userClass: UserClass;
  classes: any;
}

const TeacherClassDetails: React.FunctionComponent<TeacherClassDetailsProps> = ({
  userClass,
  classes,
}) => {
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
          <Fragment>
            <Typography variant="h5">Awaiting Results</Typography>
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
