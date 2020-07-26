import {
  AppBar,
  Container,
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
  const [userClass, setUserClass] = React.useState<UserClass | null>(null);

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
    const oldUserClass: UserClass = {
      classId: userClass ? userClass.classId : "",
      className: userClass ? userClass.className : "",
    };
    return (
      newUserClass.classId.indexOf(oldUserClass.classId) !== 0 ||
      oldUserClass.classId.indexOf(newUserClass.classId) !== 0 ||
      newUserClass.className.indexOf(oldUserClass.className) !== 0 ||
      oldUserClass.className.indexOf(newUserClass.className) !== 0
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
      <Container className={classes.pageTitle}>
        <Typography variant="h3">Error!</Typography>
      </Container>
    </Dialog>
  );
};

export default ClassDetails;
