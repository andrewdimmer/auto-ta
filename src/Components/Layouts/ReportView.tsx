import {
  AppBar,
  Dialog,
  Grid,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  Container,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";

declare interface ReportViewProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userClass: UserClass;
  classes: any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ReportView: React.FunctionComponent<ReportViewProps> = ({
  open,
  setOpen,
  userClass,
  classes,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

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
            Report View - {userClass?.className} - Auto TA
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={classes.marginedTopBottom}>
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <strong>Andrew Dimmer</strong>
            </Grid>
            <Grid item xs={1}>
              Yes
            </Grid>
            <Grid item xs={1}>
              No
            </Grid>
            <Grid item xs={1}>
              0
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <strong>B</strong>
            </Grid>
            <Grid item xs={1}>
              Maybe
            </Grid>
            <Grid item xs={1}>
              <strong>-- --</strong>
            </Grid>
            <Grid item xs={1}>
              0
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <strong>C</strong>
            </Grid>
            <Grid item xs={1}>
              No
            </Grid>
            <Grid item xs={1}>
              No
            </Grid>
            <Grid item xs={1}>
              <strong>--1--</strong>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Dialog>
  );
};

export default ReportView;
