import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { nanoid } from "nanoid";
import React, { Fragment } from "react";
import { PageProps } from ".";
import {
  createNewClass,
  getUserClasses,
  joinNewClass,
} from "../../Scripts/firebaseClassesDatabaseCalls";
import ClassListItem from "../Content/ClassListItem";
import ClassDetails from "../Layouts/ClassDetails";

const ClassesPage: React.FunctionComponent<PageProps> = ({
  setLoadingMessage,
  setNotification,
  userMode,
  currentUserProfile,
  classes,
}) => {
  const [userClasses, setUserClasses] = React.useState<UserClass[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const [createClassOpen, setCreateClassOpen] = React.useState<boolean>(false);
  const [joinClassOpen, setJoinClassOpen] = React.useState<boolean>(false);

  const [newClassName, setNewClassName] = React.useState<string>("");
  const [joinClassCode, setJoinClassCode] = React.useState<string>("");

  const handleNewClassNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewClassName(event.target.value);
  };

  const handleJoinClassCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJoinClassCode(event.target.value);
  };

  const closeAndCancel = () => {
    setCreateClassOpen(false);
    setJoinClassOpen(false);
    setJoinClassCode("");
    setNewClassName("");
  };

  const createClass = () => {
    if (newClassName) {
      setLoadingMessage("Creating New Class...");
      if (currentUserProfile) {
        const classId = nanoid();
        currentUserProfile.teaching.push(classId);
        const newClassObject: UserClass = {
          classId,
          className: newClassName,
          handRaised: false,
          currentQuestion: "",
          currentQuestionType: "",
        };
        createNewClass(
          currentUserProfile.userId,
          currentUserProfile.teaching,
          newClassObject
        )
          .then((status) => {
            if (status) {
              const newUserClasses = userClasses.concat([newClassObject]);
              setUserClasses(newUserClasses);
              setLoadingMessage("");
              setNotification({
                type: "success",
                message: "New Class Created Successfully.",
                open: true,
              });
              closeAndCancel();
            } else {
              setLoadingMessage("");
              setNotification({
                type: "error",
                message: "Unable to create class. Please try again later.",
                open: true,
              });
              closeAndCancel();
            }
          })
          .catch((err) => {
            console.log(err);
            setLoadingMessage("");
            setNotification({
              type: "error",
              message: "Unable to create class. Please try again later.",
              open: true,
            });
            closeAndCancel();
          });
      } else {
        setLoadingMessage("");
        setNotification({
          type: "error",
          message:
            "Unable to create class. Try logging off and logging on again.",
          open: true,
        });
        closeAndCancel();
      }
    } else {
      setNotification({
        type: "warning",
        message: "Please enter a class name.",
        open: true,
      });
    }
  };

  const joinClass = () => {
    if (joinClassCode) {
      if (currentUserProfile) {
        if (!currentUserProfile.attending.includes(joinClassCode)) {
          setLoadingMessage("Joining Class...");
          currentUserProfile.attending.push(joinClassCode);
          joinNewClass(currentUserProfile.userId, currentUserProfile.attending)
            .then((joinedClass) => {
              if (joinedClass) {
                const newUserClasses = userClasses.concat([joinedClass]);
                setUserClasses(newUserClasses);
                setLoadingMessage("");
                setNotification({
                  type: "success",
                  message: "New Class Joined Successfully.",
                  open: true,
                });
                closeAndCancel();
              } else {
                setLoadingMessage("");
                setNotification({
                  type: "error",
                  message:
                    "Unable to join class. Please double check you have the right class code and try again later.",
                  open: true,
                });
                closeAndCancel();
              }
            })
            .catch((err) => {
              console.log(err);
              setLoadingMessage("");
              setNotification({
                type: "error",
                message:
                  "Unable to join class. Please double check you have the right class code and try again later.",
                open: true,
              });
              closeAndCancel();
            });
        } else {
          setNotification({
            type: "warning",
            message: "You've already joined this class!",
            open: true,
          });
          closeAndCancel();
        }
      } else {
        setNotification({
          type: "error",
          message:
            "Unable to join class. Try logging off and logging on again.",
          open: true,
        });
        closeAndCancel();
      }
    } else {
      setNotification({
        type: "warning",
        message: "Please enter a class code.",
        open: true,
      });
    }
  };

  const getClassIdsByMode = () => {
    return currentUserProfile
      ? userMode === "teacher"
        ? currentUserProfile.teaching
        : userMode === "student"
        ? currentUserProfile.attending
        : []
      : [];
  };

  const loadClasses = () => {
    if (currentUserProfile && !loaded) {
      setLoaded(true);
      getUserClasses(getClassIdsByMode()).then((newUserClasses) => {
        setUserClasses(newUserClasses);
      });
    }
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Classes</Typography>
      </Container>
      {userClasses.map((userClass) => {
        return (
          <ClassListItem
            userClass={userClass}
            userMode={userMode}
            userId={currentUserProfile ? currentUserProfile.userId : "void"}
            classes={classes}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            key={userClass.classId}
          />
        );
      })}
      {userMode && (
        <Container className={classes.pageTitle}>
          <Fab
            variant="extended"
            color="primary"
            onClick={() => {
              if (userMode === "teacher") {
                setCreateClassOpen(true);
              } else {
                setJoinClassOpen(true);
              }
            }}
          >
            <AddIcon />
            {userMode === "teacher" ? "Create New Class" : "Join Class"}
          </Fab>
        </Container>
      )}
      {setTimeout(loadClasses, 1) && <Fragment />}

      <Dialog open={createClassOpen} onClose={closeAndCancel}>
        <DialogTitle>Create a New Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of your class below, then click "Create Class".
          </DialogContentText>
          <TextField
            autoFocus
            label="Class Name"
            fullWidth
            value={newClassName}
            onChange={handleNewClassNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAndCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={createClass} color="primary">
            Create Class
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={joinClassOpen} onClose={closeAndCancel}>
        <DialogTitle>Join a Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the class code provided by your teacher to join the class.
          </DialogContentText>
          <TextField
            autoFocus
            label="Class Code"
            fullWidth
            value={joinClassCode}
            onChange={handleJoinClassCodeChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAndCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={joinClass} color="primary">
            Join Class
          </Button>
        </DialogActions>
      </Dialog>

      <ClassDetails
        open={window.location.href.includes("?classId=")}
        setOpen={(open) => {
          /* Note: If opened as a pop-out, the user should be locked to that page. */
        }}
        userMode={userMode}
        userId={currentUserProfile ? currentUserProfile.userId : "void"}
        classId={window.location.href.substring(
          window.location.href.indexOf("?classId=") + "?classId=".length,
          window.location.href.length
        )}
        setLoadingMessage={setLoadingMessage}
        setNotification={setNotification}
        loadedFromURL={true}
        classes={classes}
      />
    </Fragment>
  );
};

export default ClassesPage;
