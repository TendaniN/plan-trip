import {
  Box,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import logoImg from "assets/branding/logo-transparent.png";
import styled from "@emotion/styled";
import { useState } from "react";
import { useAccountStore } from "stores/account";
import { FaRegCircleUser } from "react-icons/fa6";

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
  const { id, username } = useAccountStore((state) => state);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledBox>
      <LogoContainer to="/">
        <img src={logoImg} />
      </LogoContainer>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 35, height: 35 }}>
            {id === 0 && username === "" ? (
              <FaRegCircleUser />
            ) : (
              username.toUpperCase().charAt(0)
            )}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        <MenuItem href="/account" onClick={handleClose}>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem href="/trip" onClick={handleClose}>
          My Trips
        </MenuItem>
        <MenuItem href="#" onClick={handleClose}>
          Logout
        </MenuItem>
      </Menu>
    </StyledBox>
  );
};
