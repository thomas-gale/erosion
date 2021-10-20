import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f57c00',
    },
    secondary: {
      main: '#757575',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#999999',
    },
  },
});
