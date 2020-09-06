import { Container } from "@material-ui/core";
import React, { Fragment } from "react";
import { createFirebaseAuthListener } from "../Scripts/firebaseAuthSync";
import { firebaseApp } from "../Scripts/firebaseConfig";
import { getUserProfileDatabase } from "../Scripts/firebaseUserDatabaseCalls";
import { styles } from "../Styles";
import NavBar from "./Layouts/NavBar";
import BugReportFab from "./Misc/BugReportFab";
import LoadingScreen from "./Misc/LoadingScreen";
import NotificationBar, { NotificationMessage } from "./Misc/Notifications";
import { getPageComponent, getPageTitle } from "./Pages";

declare interface AppProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const App: React.FunctionComponent<AppProps> = ({ theme, toggleTheme }) => {
  const [notification, setNotification] = React.useState<NotificationMessage>({
    type: "info",
    message: "",
    open: false,
  });
  const [loadingMessage, setLoadingMessage] = React.useState<string>("");
  const [pageKey, setPageKey] = React.useState<string>("login");
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(
    null
  );
  const [
    currentUserProfile,
    setCurrentUserProfile,
  ] = React.useState<UserProfile | null>(null);

  const PageContent = getPageComponent(pageKey);
  const classes = styles();
  const [userMode, setUserMode] = React.useState<UserMode | "">("");
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const handleLoadUserData = (userId: string) => {
    if (userId) {
      setLoadingMessage("Loading Data...");
      getUserProfileDatabase(userId)
        .then((data) => {
          setCurrentUserProfile(data);
          setCurrentUser(firebaseApp.auth().currentUser);
          setLoadingMessage("");
        })
        .catch(() => {
          setNotification({
            type: "error",
            message: "Unable to get User Data... Please try again later.",
            open: true,
          });
          setCurrentUserProfile(null);
          setCurrentUser(null);
          setLoadingMessage("");
        });
    } else {
      setCurrentUserProfile(null);
      setCurrentUser(null);
    }
  };

  const handleChangeUserMode = (newUserMode: UserMode) => {
    setUserMode(newUserMode);
    window.localStorage.setItem("userMode", newUserMode);
  };

  const initAutoTA = () => {
    if (!loaded) {
      setLoaded(true);
      createFirebaseAuthListener((user) => {
        handleLoadUserData(user ? user.uid : "");
        if (user) {
          setPageKey("classes");
          const localStorageUserMode = window.localStorage.getItem(
            "userMode"
          ) as UserMode | null;
          setUserMode(
            localStorageUserMode !== null ? localStorageUserMode : ""
          );
        } else {
          setPageKey("login");
        }
      });
    }
  };

  setTimeout(() => {
    initAutoTA();
  }, 1);

  return (
    <Fragment>
      <NavBar
        pageTitle={getPageTitle(pageKey)}
        setPageKey={setPageKey}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUserProfile={currentUserProfile}
      />
      <Container className={classes.marginedTopBottom}>
        <PageContent
          setPageKey={setPageKey}
          setLoadingMessage={setLoadingMessage}
          setNotification={setNotification}
          handleLoadUserData={handleLoadUserData}
          setUserMode={handleChangeUserMode}
          userMode={userMode}
          currentUser={currentUser}
          currentUserProfile={currentUserProfile}
          classes={classes}
        />
      </Container>
      <LoadingScreen loadingMessage={loadingMessage} />
      <NotificationBar
        notification={notification}
        setNotification={setNotification}
      />
      <BugReportFab />
    </Fragment>
  );
};

export default App;
