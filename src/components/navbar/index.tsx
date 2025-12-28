import { Box, Image } from "@mantine/core";
import { Link } from "react-router-dom";

import { UnAuthenticated } from "./unauthenticated";
import { Authenticated } from "./authenticated";
import { AuthWrapper } from "components";
import logoImg from "assets/branding/logo-transparent.png";

const boxStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "0.5rem 1rem",
  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)",
};

export const Navbar = () => {
  return (
    <Box style={boxStyle}>
      <Link to="/">
        <Image w="5rem" src={logoImg} />
      </Link>
      <AuthWrapper renderDenied={<UnAuthenticated />}>
        <Authenticated />
      </AuthWrapper>
    </Box>
  );
};
