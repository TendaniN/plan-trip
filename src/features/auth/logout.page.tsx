import { Flex, Loader } from "@mantine/core";
import { logoutUser } from "api/auth";
import { useAuthStore, useDBStore } from "db/store";
import { useEffect } from "react";

const LogoutPage = () => {
  const clearState = useDBStore((state) => state.clearState);
  const clear = useAuthStore((state) => state.clear);

  const handleLogout = async () => {
    await logoutUser();
    clearState();
    clear();
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <Flex w="100%" h="100%">
      <Loader mx="auto" my="auto" size="5rem" type="bars" color="secondary.6" />
    </Flex>
  );
};

export default LogoutPage;
