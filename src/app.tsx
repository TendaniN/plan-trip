import { type ReactNode } from "react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme, Container } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";

import AppRoutes from "routes/index";
import "./styles.css";

const theme = createTheme({
  fontFamily: "Inter, system-ui, sans-serif",
  headings: { fontFamily: "Chango, cursive", fontWeight: "400" },
  colors: {
    primary: [
      "#FEF7FA",
      "#FDEBF2",
      "#FCDCE7",
      "#FACBDC",
      "#F8BCD2",
      "#F7ADC8",
      "#D293AA",
      "#AF7B8E",
      "#8D6372",
      "#6F4E5A",
    ],
    secondary: [
      "#FFFAEF",
      "#FFF2D7",
      "#FEE8B8",
      "#FEDE97",
      "#FDD478",
      "#FDCA5A",
      "#D7AC4D",
      "#B48F40",
      "#907333",
      "#725B28",
    ],
    gray: [
      "#FDFCFC",
      "#F9F9F8",
      "#F5F4F3",
      "#F0EFED",
      "#EBEAE7",
      "#E7E5E2",
      "#C4C3C0",
      "#A4A3A0",
      "#848381",
      "#686766",
    ],
    green: [
      "#F6FFF8",
      "#E9FFEE",
      "#D7FFE1",
      "#C5FFD4",
      "#B4FFC6",
      "#A3FFBA",
      "#8BD99E",
      "#74B584",
      "#5D916A",
      "#497354",
    ],
    purple: [
      "#FDF3FF",
      "#FAE3FF",
      "#F6CDFF",
      "#F2B5FF",
      "#EF9FFF",
      "#EB8AFF",
      "#C875D9",
      "#A762B5",
      "#864F91",
      "#6A3E73",
    ],
    blue: [
      "#F6F7FF",
      "#E9EDFF",
      "#D7DEFF",
      "#C5CEFF",
      "#B4C0FF",
      "#A3B2FF",
      "#8B97D9",
      "#747EB5",
      "#5D6591",
      "#495073",
    ],
  },
});

const ContainerWrapper = ({ children }: { children: ReactNode }) => (
  <Container bg="gray.5" h="100vh" maw="100%" m={0} p={0}>
    {children}
  </Container>
);

export default function App() {
  return (
    <MantineProvider theme={theme} stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <Notifications />
        <BrowserRouter basename="/plan-trip">
          <ContainerWrapper>
            <AppRoutes />
          </ContainerWrapper>
        </BrowserRouter>
      </MantineEmotionProvider>
    </MantineProvider>
  );
}
