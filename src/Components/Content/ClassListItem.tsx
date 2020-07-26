import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import React, { Fragment } from "react";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import ClassIcon from "@material-ui/icons/Class";
import ClassDetails from "../Layouts/ClassDetails";

declare interface ClassListItemProps {
  userClass: UserClass;
  userMode: UserMode;
  classes: any;
}

const ClassListItem: React.FunctionComponent<ClassListItemProps> = ({
  userClass,
  userMode,
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
          </ListItemSecondaryAction>
        </ListItem>
      </Paper>

      <ClassDetails
        open={detailsOpen}
        setOpen={setDetailsOpen}
        userMode={userMode}
        classId={userClass.classId}
        classes={classes}
      />
    </Fragment>
  );
};

export default ClassListItem;
