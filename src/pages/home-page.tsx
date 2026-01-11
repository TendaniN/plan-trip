import { Container, Title, Box, Flex, Alert } from "@mantine/core";
import { LinkButton, TripForm } from "components";
import { MAX_DB_ENTRIES } from "constants/db";
import { useDBStore } from "db/store";
import { FaEye, FaCircleInfo } from "react-icons/fa6";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const HomePage = () => {
  const { trips } = useDBStore((state) => state);
  return (
    <Container p={24} h="calc(100vh - 60px)">
      {trips.length >= MAX_DB_ENTRIES ? (
        <Alert
          color="red"
          radius="lg"
          title="No new trips can be added"
          icon={<FaCircleInfo />}
        >
          Maximum number of database entries for trips reached. Please delete
          past trips <Link to="/trip">here</Link> to make space for new ones.
        </Alert>
      ) : (
        <>
          <Title mt={36} mb={18} order={2} ta="center">
            Plan a Trip
          </Title>

          <Box bdrs={12} bd="6px solid #000" p={20} bg="primary.3">
            <TripForm />
          </Box>
        </>
      )}

      {trips.length > 0 && (
        <>
          <Title mt={36} mb={18} order={2} ta="center">
            {trips.length >= MAX_DB_ENTRIES ? "" : "Or "}Continue Editing
          </Title>
          <Box>
            {trips
              .sort(
                (a, b) =>
                  dayjs(b.start_date).valueOf() - dayjs(a.start_date).valueOf()
              )
              .map(({ id, name }, index) => (
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
