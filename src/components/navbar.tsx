import { Box, Tabs, Tab } from "@mui/material";
import { Link } from "react-router-dom";
import logoImg from "assets/branding/logo-transparent.png";
import styled from "@emotion/styled";

const LogoContainer = styled(Link)`
  img {
    width: 5rem;
  }
`;

const StyledBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 2rem);
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);

  a {
    font-family: "Chango", system-ui;

    &:hover {
      color: #000;
    }
  }
`;

export const Navbar = () => {
  return (
    <StyledBox>
      <LogoContainer to="/">
        <img src={logoImg} />
      </LogoContainer>
      <Tabs role="navigation">
        <Tab label="About" href="/about" />
        <Tab label="Contact Us" href="/contact" />
      </Tabs>
    </StyledBox>
  );
};
