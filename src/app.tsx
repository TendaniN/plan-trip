import { createTheme, ThemeProvider } from "@mui/material/styles";
import Pages from "pages/index";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({ cssVariables: true });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
