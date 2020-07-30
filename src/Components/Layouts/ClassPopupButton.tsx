import { Fab } from "@material-ui/core";
import PictureInPictureIcon from "@material-ui/icons/PictureInPicture";
import React, { Fragment } from "react";

declare interface ClassPopupButtonProps {
  classId: string;
}

const ClassPopupButton: React.FunctionComponent<ClassPopupButtonProps> = ({
  classId,
}) => {
  const screenWidth = React.useRef<HTMLDivElement>(null);
  const screenHeight = React.useRef<HTMLDivElement>(null);

  return (
    <Fragment>
      <div
        ref={screenWidth}
        style={{
          width: `100vw`,
          height: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div
        ref={screenHeight}
        style={{
          width: 0,
          height: `100vh`,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <Fab
        color="primary"
        size="small"
        onClick={() => {
          window.open(
            window.location.href,
            "_blank",
            `width=300,height=300,left=${
              screenWidth.current?.clientWidth
                ? screenWidth.current.clientWidth - 300 > 0
                  ? screenWidth.current.clientWidth - 300
                  : 0
                : 0
            },top=${
              screenHeight.current?.clientHeight
                ? screenHeight.current.clientHeight - 300 > 0
                  ? screenHeight.current.clientHeight - 300
                  : 0
                : 0
            }`
          );
        }}
      >
        <PictureInPictureIcon />
      </Fab>
    </Fragment>
  );
};

export default ClassPopupButton;
