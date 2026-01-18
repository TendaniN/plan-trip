import { Box, Flex, Image, Title } from "@mantine/core";
import { Link } from "react-router-dom";

import { UnAuthenticated } from "./unauthenticated";
import { Authenticated } from "./authenticated";
import { AuthWrapper, CurrencyDropdown } from "components";
import logoImg from "assets/branding/logo-transparent.png";

const boxStyle = {
  root: {
    padding: "0.5rem 1rem",
    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)",

    "& a": {
      color: "#000",
      textDecoration: "none",
      margin: "auto 0",

      ":hover": {
        textDecoration: "underline",
      },
    },
  },
};

export const Navbar = () => (
  <Flex justify="space-between" w="100%" styles={boxStyle}>
    <Link to="/">
      <Image w="5rem" src={logoImg} />
    </Link>
    <AuthWrapper renderDenied={null}>
      <Link to="/trip">
        <Title fz="h2">My Trips</Title>
      </Link>
    </AuthWrapper>
    <AuthWrapper renderDenied={<UnAuthenticated />}>
      <Flex gap={12}>
        <Box my="auto">
          <CurrencyDropdown />
        </Box>
        <Authenticated />
      </Flex>
    </AuthWrapper>
  </Flex>
);
