import { Menu, MenuTarget, MenuDropdown, Box } from "@mantine/core";
import { FaCircleUser } from "react-icons/fa6";

import { Button, LinkButton } from "components";

export const UnAuthenticated = () => (
  <Menu width={200}>
    <MenuTarget>
      <Button>
        <FaCircleUser size={28} />
      </Button>
    </MenuTarget>
    <MenuDropdown
      bdrs={12}
      p={8}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #000",
      }}
    >
      <LinkButton color="green-4" to="/login">
        Login
      </LinkButton>
      <Box py={8} mx="auto">
        OR
      </Box>
      <LinkButton to="/register">Regiser</LinkButton>
    </MenuDropdown>
  </Menu>
);
