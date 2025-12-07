import { createTheme, ThemeProvider } from "@mui/material/styles";
import Pages from "pages/index";
import { BrowserRouter } from "react-router-dom";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import "moment/locale/en-gb";

const theme = createTheme({ cssVariables: true });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        adapterLocale={moment.locale("en-gb")}
      >
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
