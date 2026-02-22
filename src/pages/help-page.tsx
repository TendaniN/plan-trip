import {
  Box,
  Container,
  Flex,
  SimpleGrid,
  Image,
  Text,
  Title,
  List,
  ListItem,
  ScrollArea,
} from "@mantine/core";
import { Breadcrumbs, ProtectedRoute } from "components";
import { FaHouse } from "react-icons/fa6";
import tripFormImg from "assets/help/trip-form.png";
import tripPageImg from "assets/help/trip-page.png";
import locationPageImg from "assets/help/location-page.png";
import budgetPageImg from "assets/help/budget-page.png";
import exportModalImg from "assets/help/export-modal.png";

const items = [
  { title: "Home", to: "/", icon: <FaHouse /> },
  { title: "Help", to: "/help" },
];

const HelpPage = () => (
  <ProtectedRoute>
    <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
      <Breadcrumbs items={items} />
      <Flex direction="column" gap="xl">
        <Box mx="auto">
          <Title ta="center">How to Plan Your Trip</Title>
          <Text ta="center">
            Follow these steps to create a trip, plan activities, manage your
            budget, and export everything when you’re done.
          </Text>
        </Box>
        <ScrollArea
          type="auto"
          h="calc(100vh - 200px)"
          offsetScrollbars
          pb={16}
        >
          <Flex direction="column" gap={12} p={16}>
            <Title order={2} mx="auto">
              1. Create a Trip
            </Title>
            <SimpleGrid cols={2}>
              <Flex my="auto" direction="column">
                <Text>
                  Start by choosing a city, your travel dates, and a name for
                  your trip. This creates the main container for everything
                  else.
                </Text>
                <List mt="xs">
                  <ListItem>City is required and grouped by country</ListItem>
                  <ListItem>Trip duration is calculated automatically</ListItem>
                  <ListItem>You can rename the trip at any time</ListItem>
                </List>
              </Flex>
              <Image src={tripFormImg} maw={800} />
            </SimpleGrid>
          </Flex>
          <Flex direction="column" gap={12} p={16}>
            <Title order={2} mx="auto">
              2. Add Locations
            </Title>
            <SimpleGrid cols={2}>
              <Flex my="auto" direction="column">
                <Text>
                  A <b>location</b> represents a stay in a city. You can add the
                  same city more than once if you change accommodation or return
                  later.
                </Text>
                <List mt="xs">
                  <ListItem>
                    Arrival and departure dates define nights stayed
                  </ListItem>
                  <ListItem>Accommodation is optional</ListItem>
                  <ListItem>Locations are added from the Trip page</ListItem>
                </List>
              </Flex>
              <Image src={tripPageImg} maw={800} />
            </SimpleGrid>
          </Flex>
          <Flex direction="column" gap={12} p={16}>
            <Title order={2} mx="auto">
              3. Plan Activities
            </Title>
            <SimpleGrid cols={2}>
              <Flex my="auto" direction="column">
                <Text>
                  Activities make up your itinerary. Each activity belongs to a
                  specific location.
                </Text>
                <List mt="xs">
                  <ListItem>Add activities from the Location page</ListItem>
                  <ListItem>
                    Dates must fall within the location’s stay
                  </ListItem>
                  <ListItem>
                    A full list of supported currencies can be found{" "}
                    <a href="https://www.exchangerate-api.com/docs/supported-currencies">
                      here
                    </a>
                    . <small>Note: the reference currency is ZAR</small>
                  </ListItem>
                </List>
              </Flex>
              <Image src={locationPageImg} maw={800} />
            </SimpleGrid>
          </Flex>
          <Flex direction="column" gap={12} p={16}>
            <Title order={2} mx="auto">
              4. Manage Your Budget
            </Title>
            <SimpleGrid cols={2}>
              <Flex my="auto" direction="column">
                <Text>
                  Use the Budget page to add travel costs and a buffer for extra
                  expenses. This helps you understand the total cost of your
                  trip.
                </Text>
              </Flex>
              <Image src={budgetPageImg} maw={800} />
            </SimpleGrid>
          </Flex>
          <Flex direction="column" gap={12} p={16}>
            <Title order={2} mx="auto">
              5. Export Your Trip
            </Title>
            <SimpleGrid cols={2}>
              <Flex my="auto" direction="column">
                <Text>
                  Download your trip as an Excel, PDF, or presentation file.
                </Text>
                <List mt="xs">
                  <ListItem>Summary: dates, locations, and nights</ListItem>
                  <ListItem>Locations: full itinerary with activities</ListItem>
                  <ListItem>Accommodation: planning view (Excel only)</ListItem>
                  <ListItem>Budget: costs and savings plan</ListItem>
                </List>
              </Flex>
              <Image src={exportModalImg} w={300} mah={400} />
            </SimpleGrid>
          </Flex>
        </ScrollArea>
      </Flex>
    </Container>
  </ProtectedRoute>
);

export default HelpPage;
