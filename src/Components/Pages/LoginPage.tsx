import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";
import LoginUi from "../Content/LoginUi";
import { createNewUserDatabaseObjects } from "../../Scripts/firebaseUserDatabaseCalls";

const LoginPage: React.FunctionComponent<PageProps> = ({
  setPageKey,
  setLoadingMessage,
  setNotification,
  handleLoadUserData,
  setUserMode,
  userMode,
  currentUser,
  classes,
}) => {
  const newUserCallback = (authResult: firebase.auth.UserCredential) => {
    if (authResult.user) {
      const user = authResult.user;
      setLoadingMessage("Creating Account...");
      createNewUserDatabaseObjects({
        userId: user.uid,
        displayName: user.displayName ? user.displayName : "",
        email: user.email ? user.email : "",
        photoUrl: user.photoURL ? user.photoURL : "",
      })
        .then((value) => {
          if (value) {
            setNotification({
              type: "info",
              message:
                "Almost there! Please complete the form below to finish creating your account.",
              open: true,
            });
            handleLoadUserData(user.uid);
            setPageKey("profile");
            setLoadingMessage("");
          } else {
            setNotification({
              type: "error",
              message:
                "Unable to finish creating your account. Please try again later.",
              open: true,
            });
            setPageKey("logout");
            setLoadingMessage("");
          }
        })
        .catch((err) => {
          console.log(err);
          setNotification({
            type: "error",
            message:
              "Unable to finish creating your account. Please try again later.",
            open: true,
          });
          setPageKey("logout");
          setLoadingMessage("");
        });
    } else {
      setNotification({
        type: "error",
        message:
          "Unable to finish creating your account. Please try again later.",
        open: true,
      });
    }
  };

  const existingUserCallback = (authResult: firebase.auth.UserCredential) => {
    handleLoadUserData(authResult.user?.uid ? authResult.user.uid : "");
    setPageKey("classes");
    setNotification({
      type: "success",
      message: "Successfully Signed In",
      open: true,
    });
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Join or Login</Typography>
      </Container>
      {!userMode ? (
        <Fragment>
          <Button
            color={currentUser ? "inherit" : "primary"}
            fullWidth
            variant="contained"
            size="large"
            className={classes.marginedTopBottom}
            onClick={() => {
              setUserMode("student");
            }}
          >
            <Typography variant="h4">I'm a Student</Typography>
          </Button>
          <Button
            color={currentUser ? "inherit" : "primary"}
            fullWidth
            variant="contained"
            size="large"
            className={classes.marginedTopBottom}
            onClick={() => {
              setUserMode("teacher");
            }}
          >
            <Typography variant="h4">I'm a Teacher</Typography>
          </Button>
        </Fragment>
      ) : (
        <LoginUi
          allowEmailAuth={true}
          allowPhoneAuth={false}
          allowAnonymousAuth={false}
          newUserCallback={newUserCallback}
          existingUserCallback={existingUserCallback}
          classes={classes}
        />
      )}
    </Fragment>
  );
};

export default LoginPage;
