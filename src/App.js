
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import {AppWithRouter} from "./AppWithRouter";
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  return (
      <ThemeProvider theme={darkTheme}>
        <AppWithRouter/>
      </ThemeProvider>
  );
}

export default App;
