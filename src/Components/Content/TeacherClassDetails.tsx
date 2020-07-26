import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { ackRaisedHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";
import AudioPlayer from "react-h5-audio-player";

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
            >
              <Typography variant="h5">Acknowledge Raised Hand</Typography>
            </Button>
          </Fragment>
        )}
      </Container>
    </Fragment>
  );
};

export default TeacherClassDetails;
