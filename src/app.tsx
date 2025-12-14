import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Pages from "pages/index";
import styled from "@emotion/styled";
import { BrowserRouter } from "react-router-dom";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import { initDB } from "stores/db";
import { PageSpinner } from "components";
import "moment/locale/en-gb";

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const theme = createTheme({ cssVariables: true });

function App() {
  const [siteLoading, setSiteLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initDB();
      setSiteLoading(false);
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        adapterLocale={moment.locale("en-gb")}
      >
        <BrowserRouter>
          <Container>{siteLoading ? <PageSpinner /> : <Pages />}</Container>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
