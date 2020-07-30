import {
  AppBar,
  Container,
  Dialog,
  IconButton,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from "@material-ui/icons/Close";
import React, { Fragment } from "react";
import { getReportData } from "../../Scripts/firebaseReportGenerationCalls";
import { NotificationMessage } from "../Misc/Notifications";

declare interface ReportViewProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userClass: UserClass;
  setLoadingMessage: (message: string) => void;
  setNotification: (notification: NotificationMessage) => void;
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
  setLoadingMessage,
  setNotification,
  classes,
}) => {
  const [reportData, setReportData] = React.useState<{
    students: UserPublicProfile[];
    questions: Question[];
  } | null>(null);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
    setLoaded(false);
  };

  const initReportData = () => {
    if (open && !loaded) {
      setLoadingMessage("Generating Report...");
      setLoaded(true);
      getReportData(userClass.classId)
        .then((data) => {
          setReportData(data);
          if (!data) {
            setNotification({
              type: "error",
              message: "Unable to get report data. Please try again soon.",
              open: true,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setNotification({
            type: "error",
            message: "Unable to get report data. Please try again soon.",
            open: true,
          });
        })
        .finally(() => {
          setLoadingMessage("");
        });
    }
  };

  initReportData();

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
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Correct Answer</TableCell>
                {reportData ? (
                  reportData.questions.map((questionData) => {
                    return (
                      <TableCell align="right" key={questionData.questionId}>
                        {questionData.type === "poll"
                          ? "Poll"
                          : questionData.correctAnswer
                          ? questionData.correctAnswer
                          : "No Correct Answer"}
                      </TableCell>
                    );
                  })
                ) : (
                  <Fragment />
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData ? (
                reportData.students.map((studentData) => (
                  <TableRow key={studentData.userId}>
                    <TableCell component="th" scope="row">
                      {studentData.displayName}
                    </TableCell>
                    {reportData ? (
                      reportData.questions.map((questionData) => {
                        return (
                          <TableCell
                            align="right"
                            key={questionData.questionId}
                          >
                            {questionData.answers[studentData.userId]}
                          </TableCell>
                        );
                      })
                    ) : (
                      <Fragment />
                    )}
                  </TableRow>
                ))
              ) : (
                <Fragment />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Dialog>
  );
};

export default ReportView;
