import {
  Menu,
  MenuTarget,
  MenuDropdown,
  Box,
  MenuDivider,
  MenuItem,
  Flex,
} from "@mantine/core";
import { FaCircleUser, FaUserGear, FaDoorOpen } from "react-icons/fa6";
import { createStyles } from "@mantine/emotion";

import { useAuthStore, useDBStore } from "db/store";
import { Button } from "components";
import { Link } from "react-router-dom";

const useStyles = createStyles(() => ({
  item: {
    borderRadius: 12,
    padding: "6px 8px",

    "&:hover": {
      backgroundColor: "var(--mantine-color-blue-2)",
    },
  },
}));

export const Authenticated = () => {
  const { classes } = useStyles();

  const { firstName, lastName } = useDBStore((state) => state);
  const { email } = useAuthStore((state) => state);

  return (
    <Menu width={200}>
      <MenuTarget>
        <Button>
          {firstName}
          <FaCircleUser size={28} />
        </Button>
      </MenuTarget>
      <MenuDropdown
        bdrs={12}
        py={6}
        bd="1px solid #000"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box px={8}>
          <Flex c="#000" fz="sm">{`${firstName} ${lastName}`}</Flex>
          <Flex c="gray.8" fz="xs">
            {email}
          </Flex>
        </Box>
        <MenuDivider style={{ borderColor: "#000" }} />
        <MenuItem
          classNames={classes}
          component={Link}
          to="/profile"
          leftSection={<FaUserGear />}
        >
          Profile
        </MenuItem>
        <MenuDivider style={{ borderColor: "#000" }} />
        <MenuItem
          classNames={classes}
          className="logout"
          component={Link}
          to="/logout"
          leftSection={<FaDoorOpen />}
        >
          Logout
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
};
