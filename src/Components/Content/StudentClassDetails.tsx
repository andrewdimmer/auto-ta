import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { raiseHand } from "../../Scripts/firebaseRaiseHandDatabaseCalls";

declare interface StudentClassDetailsProps {
  userClass: UserClass;
  classes: any;
}

const StudentClassDetails: React.FunctionComponent<StudentClassDetailsProps> = ({
  userClass,
  classes,
}) => {
  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={() => raiseHand(userClass.classId)}
        >
          <Typography variant="h5">Raise Hand</Typography>
        </Button>
      </Container>
    </Fragment>
  );
};

export default StudentClassDetails;
