import { red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#f57c00",
    },
    secondary: {
      main: "#757575",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});


