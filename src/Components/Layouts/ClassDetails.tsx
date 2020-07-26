import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import {
  closeFirebaseClassListener,
  createFirebaseClassListener,
} from "../../Scripts/firebaseUserClassSync";
import StudentClassDetails from "../Content/StudentClassDetails";
import TeacherClassDetails from "../Content/TeacherClassDetails";

declare interface ClassDetailsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userMode: UserMode;
  classId: string;
  classes: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClassDetails: React.FunctionComponent<ClassDetailsProps> = ({
  open,
  setOpen,
  userMode,
  classId,
  classes,
}) => {
  const [userClass, setUserClass] = React.useState<UserClass>({
    classId: "",
    className: "",
    handRaised: false,
  });

  const handleClose = () => {
    closeFirebaseClassListener();
    setOpen(false);
  };

  const initListener = () => {
    if (open && classId) {
      createFirebaseClassListener(classId, (newUserClass) => {
        if (newUseClassDifferent(newUserClass)) {
          setUserClass(newUserClass);
        }
      });
    }
  };

  const newUseClassDifferent = (newUserClass: UserClass) => {
    return (
      newUserClass.classId.indexOf(userClass.classId) !== 0 ||
      userClass.classId.indexOf(newUserClass.classId) !== 0 ||
      newUserClass.className.indexOf(userClass.className) !== 0 ||
      userClass.className.indexOf(newUserClass.className) !== 0 ||
      userClass.handRaised !== newUserClass.handRaised
    );
  };

  initListener();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {userClass?.className} - Auto TA
          </Typography>
        </Toolbar>
      </AppBar>
      {userMode === "teacher" && (
        <TeacherClassDetails userClass={userClass} classes={classes} />
      )}
      {userMode === "student" && (
        <StudentClassDetails userClass={userClass} classes={classes} />
      )}
    </Dialog>
  );
};

export default ClassDetails;
