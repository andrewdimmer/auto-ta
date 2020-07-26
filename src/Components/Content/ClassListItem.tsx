import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import ClassIcon from "@material-ui/icons/Class";

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
  return (
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
          <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </Paper>
  );
};

export default ClassListItem;
