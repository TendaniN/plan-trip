import {
  Menu,
  MenuTarget,
  MenuDropdown,
  Box,
  MenuDivider,
  MenuItem,
  Flex,
} from "@mantine/core";
import { FaCircleUser, FaRoute, FaUserGear, FaDoorOpen } from "react-icons/fa6";
import { createStyles } from "@mantine/emotion";

import { useDBStore } from "db/store";
import { Button } from "components";
import { Link } from "react-router-dom";
import { formatDuration } from "utils/format-duration";
import { getSessionRemainingMs } from "utils/session";

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

  const { username, first_name, last_name } = useDBStore((state) => state);

  return (
    <Menu width={200}>
      <MenuTarget>
        <Button>
          {username}
          <FaCircleUser size={28} />
        </Button>
      </MenuTarget>
      <MenuDropdown
        bdrs={12}
        py={6}
        style={{
          display: "flex",
          flexDirection: "column",
          border: "1px solid #000",
        }}
      >
        <Box px={8}>
          <Flex color="#000" fz="sm">{`${first_name} ${last_name}`}</Flex>
          <Flex color="gray-5" fz="xs">{`Session Ends: ${formatDuration(
            getSessionRemainingMs()
          )}`}</Flex>
        </Box>
        <MenuDivider style={{ borderColor: "#000" }} />
        <MenuItem
          classNames={classes}
          component={Link}
          to="/trip"
          leftSection={<FaRoute />}
        >
          My Trips
        </MenuItem>
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
