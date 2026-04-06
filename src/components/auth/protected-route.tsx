import { Flex, Loader } from "@mantine/core";
import { useAuthStore } from "db";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { uid } = useAuthStore((state) => state);

  if (uid === "") {
    return (
      <Flex w="100%" h="100%">
        <Loader mx="auto" my="auto" size="5rem" color="primary.6" />
      </Flex>
    );
  }
  return children;
};
