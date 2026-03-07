import { Box, Container, Flex, Title } from "@mantine/core";
import {
  AddTripModal,
  Breadcrumbs,
  LinkButton,
  ProtectedRoute,
} from "components";
import dayjs from "dayjs";
import { useDBStore } from "db/store";
import { FaEye, FaHouse } from "react-icons/fa6";

const TripsPage = () => {
  const { trips } = useDBStore((state) => state);

  return (
    <ProtectedRoute>
      <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
        <Breadcrumbs
          items={[
            { title: "Home", to: "/", icon: <FaHouse /> },
            { title: "Trip", to: "/trip" },
          ]}
        />
        <Flex direction="column" gap="xl">
          <Box>
            <Flex justify="space-between">
              <Title>My Trips</Title>
            </Flex>
          </Box>
          <Flex direction="column" gap={8}>
            <Box>
              <Flex justify="flex-end">
                <AddTripModal />
              </Flex>
            </Box>
            <Box>
              <Flex w="100%" h="calc(100vh - 16rem)" direction="column" gap={8}>
                {trips
                  .sort(
                    (a, b) =>
                      dayjs(b.start_date).valueOf() -
                      dayjs(a.start_date).valueOf(),
                  )
                  .map(({ id, name }, index) => (
                    <Flex
                      bg={index % 2 === 0 ? "purple.1" : "blue.1"}
                      bdrs={8}
                      px={16}
                      py={8}
                      key={`trip-${id}`}
                      justify="space-between"
                      bd="2px solid #000"
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
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </ProtectedRoute>
  );
};

export default TripsPage;
