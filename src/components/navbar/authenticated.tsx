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

import { useDBStore } from "db/store";
import { Button } from "components";
import { Link } from "react-router-dom";
import { formatDuration } from "utils/format-duration";
import { clearSession, getSessionRemainingMs } from "utils/session";
import { useEffect, useState } from "react";

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
  const [remainingMs, setRemainingMs] = useState(getSessionRemainingMs());

  const { classes } = useStyles();

  const { username, first_name, last_name } = useDBStore((state) => state);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getSessionRemainingMs();

      if (remaining <= 0) {
        clearSession();
        setRemainingMs(0);
        clearInterval(interval);
        return;
      }

      setRemainingMs(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
        bd="1px solid #000"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box px={8}>
          <Flex c="#000" fz="sm">{`${first_name} ${last_name}`}</Flex>
          <Flex c="gray.8" fz="xs">{`Session Ends: ${formatDuration(
            remainingMs,
          )}`}</Flex>
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
