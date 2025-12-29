import { Container, Title, Box, Flex } from "@mantine/core";
import { LinkButton, TripForm } from "components";
import { useDBStore } from "db/store";
import { FaEye } from "react-icons/fa6";

const HomePage = () => {
  const { trips } = useDBStore((state) => state);
  return (
    <Container p={24} h="calc(100vh - 60px)">
      <Title mt={36} mb={18} order={2} ta="center">
        Plan a Trip
      </Title>
      <TripForm />
      {trips.length > 0 && (
        <>
          <Title mt={36} mb={18} order={2} ta="center">
            Or Continue Editing
          </Title>
          <Box>
            {trips.map(({ id, name }, index) => (
              <Flex
                bg="#fff"
                px={16}
                py={8}
                key={`trip-${id}`}
                justify="space-between"
                bd="1px solid #000"
              >
                <Title order={4} my="auto">
                  {name}
                </Title>
                <LinkButton
                  color={index % 2 == 0 ? "secondary.2" : "green.4"}
                  to={`/trip/${id}`}
                  rightSection={<FaEye />}
                >
                  View Trip
                </LinkButton>
              </Flex>
            ))}
          </Box>
        </>
      )}
    </Container>
  );
};

export default HomePage;
