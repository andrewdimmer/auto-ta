import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import ClassIcon from "@material-ui/icons/Class";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import React, { Fragment } from "react";
import ClassDetails from "../Layouts/ClassDetails";
import { NotificationMessage } from "../Misc/Notifications";
import ClassPopupButton from "../Layouts/ClassPopupButton";

declare interface ClassListItemProps {
  userClass: UserClass;
  userMode: UserMode;
  userId: string;
  setLoadingMessage: (message: string) => void;
  setNotification: (notification: NotificationMessage) => void;
  classes: any;
}

const ClassListItem: React.FunctionComponent<ClassListItemProps> = ({
  userClass,
  userMode,
  userId,
  setLoadingMessage,
  setNotification,
  classes,
}) => {
  const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);

  return (
    <Fragment>
      <Paper className={classes.marginedTopBottom}>
        <ListItem ContainerComponent="div">
          <ListItemAvatar>
            <Avatar>
              <ClassIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={userClass.className}
            secondary={userClass.classId}
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                setDetailsOpen(true);
              }}
            >
              <OpenInBrowserIcon />
            </IconButton>
            <ClassPopupButton classId={userClass.classId} />
          </ListItemSecondaryAction>
        </ListItem>
      </Paper>

      <ClassDetails
        open={detailsOpen}
        setOpen={setDetailsOpen}
        userMode={userMode}
        userId={userId}
        classId={userClass.classId}
        setLoadingMessage={setLoadingMessage}
        setNotification={setNotification}
        classes={classes}
      />
    </Fragment>
  );
};

export default ClassListItem;
