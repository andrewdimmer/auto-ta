import { Container, Grid, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";
import ViewEditUserDisplayName from "../Content/ProfileInformation/ViewEditUserDisplayName";
import ViewEditUserEmail from "../Content/ProfileInformation/ViewEditUserEmail";
import ViewEditUserPassword from "../Content/ProfileInformation/ViewEditUserPassword";
import ViewEditUserPhoto from "../Content/ProfileInformation/ViewEditUserPhoto";

const ProfilePage: React.FunctionComponent<PageProps> = ({
  userMode,
  currentUser,
  currentUserProfile,
  setPageKey,
  setNotification,
  setLoadingMessage,
  handleLoadUserData,
  setUserMode,
  classes,
}) => {
  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3" id="profileTourStep1">
          Profile
        </Typography>
      </Container>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={4} lg={3} id="profileTourStep10">
          <ViewEditUserPhoto
            userMode={userMode}
            currentUser={currentUser}
            currentUserProfile={currentUserProfile}
            handleLoadUserData={handleLoadUserData}
            setPageKey={setPageKey}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            setUserMode={setUserMode}
            classes={classes}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={9}>
          <ViewEditUserDisplayName
            userMode={userMode}
            currentUser={currentUser}
            currentUserProfile={currentUserProfile}
            handleLoadUserData={handleLoadUserData}
            setPageKey={setPageKey}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            setUserMode={setUserMode}
            classes={classes}
          />
          <ViewEditUserEmail
            userMode={userMode}
            currentUser={currentUser}
            currentUserProfile={currentUserProfile}
            handleLoadUserData={handleLoadUserData}
            setPageKey={setPageKey}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            setUserMode={setUserMode}
            classes={classes}
          />
          <ViewEditUserPassword
            userMode={userMode}
            currentUser={currentUser}
            currentUserProfile={currentUserProfile}
            handleLoadUserData={handleLoadUserData}
            setPageKey={setPageKey}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            setUserMode={setUserMode}
            classes={classes}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default ProfilePage;
