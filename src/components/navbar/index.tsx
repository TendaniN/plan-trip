import { Box, Flex, Image } from "@mantine/core";
import { Link } from "react-router-dom";

import { UnAuthenticated } from "./unauthenticated";
import { Authenticated } from "./authenticated";
import { AuthWrapper, CurrencyDropdown } from "components";
import logoImg from "assets/branding/logo-transparent.png";
import {
  FaCartFlatbedSuitcase,
  FaMapLocationDot,
  FaCircleQuestion,
} from "react-icons/fa6";

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

const linkStyle = {
  root: {
    gap: "0.5rem",
    a: {
      fontWeight: 700,
      padding: "0.325rem 0.75rem",
      borderRadius: 12,
      border: "2px solid transparent",
      backgroundColor: "var(--mantine-color-blue-4)",
      display: "flex",
      gap: "0.35rem",

      ":hover": {
        borderColor: "#000",
        textDecoration: "none",
      },

      "& svg": {
        margin: "auto 0",
      },
    },
  },
};

export const Navbar = () => (
  <Flex w="100%" styles={boxStyle}>
    <Link to="/" style={{ width: "33.33%" }}>
      <Image w="5rem" src={logoImg} />
    </Link>
    <AuthWrapper renderDenied={null}>
      <Flex w="33.33%" justify="center" styles={linkStyle}>
        <Link to="/country">
          <FaMapLocationDot />
          Countries
        </Link>
        <Link to="/trip">
          <FaCartFlatbedSuitcase />
          My Trips
        </Link>
        <Link to="/help">
          <FaCircleQuestion />
          Help
        </Link>
      </Flex>
    </AuthWrapper>
    <AuthWrapper renderDenied={<UnAuthenticated />}>
      <Flex w="33.33%" justify="flex-end" gap={12}>
        <Box my="auto">
          <CurrencyDropdown />
        </Box>
        <Authenticated />
      </Flex>
    </AuthWrapper>
  </Flex>
);
