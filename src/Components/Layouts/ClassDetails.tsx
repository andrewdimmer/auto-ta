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
  const [firestoreListener, setFirestoreListener] = React.useState<
    (() => void) | null
  >(null);

  const handleClose = () => {
    if (firestoreListener) {
      firestoreListener();
      setOpen(null);
    }
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      TransitionComponent={Transition}
    >
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              setOpen(false);
            }}
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
