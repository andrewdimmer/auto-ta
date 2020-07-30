import { Container } from "@material-ui/core";
import React, { Fragment } from "react";
import { firebaseApp } from "../Scripts/firebaseConfig";
import { getUserProfileDatabase } from "../Scripts/firebaseUserDatabaseCalls";
import { styles } from "../Styles";
import NavBar from "./Layouts/NavBar";
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
          setUserMode={setUserMode}
          userMode={userMode}
          currentUser={currentUser}
          currentUserProfile={currentUserProfile}
          classes={classes}
        />
        {/* <Button
          color="primary"
          fullWidth
          variant="outlined"
          size="large"
          className={classes.marginedTopBottom}
          onClick={() => {
            window.open(
              window.location.href,
              "_blank",
              "titlebar=no,toolbar=no,menubar=no,height=300,width=300,status=no,resize=no"
            );
            setPageKey("home");
          }}
        >
          <Typography variant="h4">Return to Home</Typography>
        </Button>
        <ClassPopupButton classId={"MTH 4553"} /> */}
      </Container>
      <LoadingScreen loadingMessage={loadingMessage} />
      <NotificationBar
        notification={notification}
        setNotification={setNotification}
      />
    </Fragment>
  );
};

export default App;
