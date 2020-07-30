import { Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";
import { firebaseApp } from "../../Scripts/firebaseConfig";

const LogoutPage: React.FunctionComponent<PageProps> = ({
  setNotification,
  setPageKey,
  handleLoadUserData,
  setUserMode,
  classes,
}) => {
  const handleLogout = () => {
    firebaseApp.auth().signOut();
    setUserMode("");
    setNotification({
      type: "success",
      message: "Successfully Signed Out",
      open: true,
    });
    handleLoadUserData("");
    setPageKey("login");
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Logout</Typography>
      </Container>
      <Typography variant="body1">
        This will eventually log the user out on load.
      </Typography>
      {setTimeout(handleLogout, 1)}
    </Fragment>
  );
};

export default LogoutPage;
