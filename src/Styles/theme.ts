import { createMuiTheme } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";

export const lightTheme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: teal,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});
