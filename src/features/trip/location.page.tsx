import {
  Container,
  Title,
  Flex,
  Text,
  Box,
  Select,
  ActionIcon,
  Collapse,
  Table,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  FaHouse,
  FaCheck,
  FaX,
  FaChevronDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa6";

import {
  Breadcrumbs,
  EditableDateInput,
  EditableTextInput,
  AddActivityModal,
  EditableNumberInput,
  EditableTimeInput,
  RemoveActivityModal,
  EditableTextareaInput,
  ProtectedRoute,
} from "components";
import { useDBStore, useLocation, useTrip } from "db";
import logger from "utils/logger";
import type { FirestoreError } from "firebase/firestore";
import { useEffect, useState } from "react";
import { sum } from "utils/sum";
import { editLocationHotel } from "api/location";
import { searchHotels } from "api/hotel";
import type { Hotel } from "types";
import { editItineraryActivity } from "api/itinerary";
import { ItineraryTableHeader } from "constants/headers";

const LocationPage = () => {
  const [selectedCollapse, setSelectedCollapse] = useState<string | null>(null);
  const [hotelOptions, setHotelOptions] = useState<
    { value: string; label: string; hotel: Hotel }[]
  >([]);

  const { tripId, locationId } = useParams();

  const { itinerary, currency } = useDBStore((state) => state);

  const trip = useTrip(tripId);
  const location = useLocation(locationId);
  const locationItinerary = itinerary.filter(
    (itinerary) => itinerary.locationId === locationId,
  );

  useEffect(() => {
    if (!location?.city) return;

    const load = async () => {
      const { combined } = await searchHotels(location.city);

      setHotelOptions(
        combined.map((h) => ({
          value: h.placeId,
          label: `${h.name} (${h.rating ?? "-"}⭐)`,
          hotel: h,
        })),
      );
    };

    load();
  }, [location?.city]);

  if (tripId === undefined || !trip) return null;
  if (locationId === undefined || !location) return null;

  const items = [
    { title: "Home", to: "/", icon: <FaHouse /> },
    { title: "Trip", to: "/trip" },
    { title: trip.name, to: `/trip/${tripId}` },
    {
      title: location.city,
      to: `/trip/${tripId}/location/${locationId}`,
    },
  ];

  const updateLocationHotel = async (hotel: Hotel) => {
    try {
      await editLocationHotel(locationId, tripId, hotel);

      showNotification({
        message: "Location accommodation updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityDate = async (id: string, date: string) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { date },
      });
      logger.info("Itinerary date was updated.");
      showNotification({
        message: "Itinerary date was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Location date was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateItineraryLink = async (id: string, link: string) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { link },
      });
      logger.info("Itinerary link was updated.");
      showNotification({
        message: "Itinerary link was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Itinerary link was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateItineraryActivity = async (id: string, activity: string) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { activity },
      });
      logger.info("Itinerary activity was updated.");
      showNotification({
        message: "Itinerary activity was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Itinerary activity was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityCost = async (id: string, cost: string | number) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { cost },
      });
      logger.info("Itinerary cost was updated.");
      showNotification({
        message: "Itinerary cost was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Itinerary cost was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityDuration = async (
    id: string,
    duration: number | string,
  ) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { duration: Number(duration) },
      });
      logger.info("Itinerary duration was updated.");
      showNotification({
        message: "Itinerary duration was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Itinerary duration was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityTime = async (id: string, time: string) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { time },
      });
      logger.info("Itinerary time was updated.");
      showNotification({
        message: "Itinerary time was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Itinerary time was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityDescription = async (id: string, description: string) => {
    try {
      await editItineraryActivity({
        locationId,
        tripId,
        activityId: id,
        change: { description },
      });
      logger.info("Itinerary description was updated.");
      showNotification({
        message: "Itinerary description was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Itinerary description was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  return (
    <ProtectedRoute>
      <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
        <Breadcrumbs items={items} />
        {trip && location && (
          <Flex direction="column" gap="xl">
            <Box>
              <Flex justify="space-between">
                <Title
                  my="auto"
                  display="flex"
                  style={{
                    gap: "0.5rem",
                    textTransform: "capitalize",
                  }}
                >
                  {location.city}
                </Title>
                <Flex direction="column" my="auto">
                  <Text size="sm">
                    <b style={{ marginRight: "0.5rem" }}>Arrive:</b>
                    {dayjs(location.start_date).format("dddd, DD MMM YYYY")}
                  </Text>
                  <Text size="sm">
                    <b style={{ marginRight: "0.5rem" }}>Depart:</b>
                    {dayjs(location.end_date).format("dddd, DD MMM YYYY")}
                  </Text>
                </Flex>
              </Flex>
              <Flex justify="space-between">
                <Text fw={600} fz="md" my="auto">{`For ${trip.name}`}</Text>

                <Select
                  value={location.accommodation?.placeId}
                  data={hotelOptions}
                  onChange={(val) => {
                    const hotel = hotelOptions.find(
                      (h) => h.value === val,
                    )?.hotel;
                    if (hotel) updateLocationHotel(hotel);
                  }}
                  rightSection={<FaChevronDown size="0.75rem" color="#000" />}
                  searchable
                  size="sm"
                  clearable={false}
                  styles={{
                    root: {
                      border: "2px solid #000",
                      borderRadius: 12,

                      "& input": {
                        borderRadius: 12,
                        border: "none",
                        backgroundColor: "var(--mantine-color-primary-2)",
                      },
                    },
                  }}
                />
              </Flex>
              <Flex fz="sm">
                <Text>{`${location.nights} nights`}</Text>
              </Flex>
            </Box>
            <Flex direction="column" gap={8}>
              <Box>
                <Flex justify="space-between">
                  <Title my="auto" order={6}>
                    Itinerary
                  </Title>

                  <AddActivityModal tripId={tripId} location={location} />
                </Flex>
              </Box>
              <Table
                bg="primary.3"
                bd="6px solid #000"
                bdrs={12}
                w="100%"
                layout="fixed"
                borderColor="#000"
                withRowBorders
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr bg="#fff">
                    {ItineraryTableHeader.map(({ id, label }) => (
                      <Table.Th key={`table-header-${id}`} fw={600}>
                        {label}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {locationItinerary
                    .sort(
                      (a, b) =>
                        dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
                    )
                    .map(
                      (
                        {
                          id,
                          date,
                          activity,
                          description,
                          time,
                          duration,
                          link,
                          cost,
                        },
                        index,
                      ) => (
                        <>
                          <Table.Tr
                            key={`table-row-${id}`}
                            bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                          >
                            <Table.Td>
                              <ActionIcon
                                variant="light"
                                color="blue.9"
                                mt="0.25rem"
                                onClick={() =>
                                  setSelectedCollapse(
                                    selectedCollapse === id ? null : id,
                                  )
                                }
                              >
                                {selectedCollapse === id ? (
                                  <FaMinus />
                                ) : (
                                  <FaPlus />
                                )}
                              </ActionIcon>
                            </Table.Td>
                            <Table.Td>
                              <EditableDateInput
                                id={id}
                                date={date}
                                start
                                onChange={updateActivityDate}
                              />
                            </Table.Td>
                            <Table.Td>
                              <EditableTextInput
                                id={id}
                                text={activity}
                                onChange={updateItineraryActivity}
                              />
                            </Table.Td>
                            <Table.Td>
                              <EditableTimeInput
                                id={id}
                                text={time}
                                onChange={updateActivityTime}
                              />
                            </Table.Td>
                            <Table.Td>
                              <EditableTextInput
                                id={id}
                                text={link}
                                onChange={updateItineraryLink}
                              />
                            </Table.Td>
                            <Table.Td>
                              <EditableNumberInput
                                id={id}
                                text={cost}
                                preText={`${currency} `}
                                onChange={updateActivityCost}
                              />
                            </Table.Td>
                            <Table.Td>
                              <EditableNumberInput
                                id={id}
                                text={duration}
                                postText="hours"
                                onChange={updateActivityDuration}
                              />
                            </Table.Td>
                            <Table.Td>
                              {trip.locations.length > 1 && (
                                <RemoveActivityModal
                                  locationId={locationId}
                                  activityId={id}
                                />
                              )}
                            </Table.Td>
                          </Table.Tr>
                          <Collapse
                            in={selectedCollapse === id}
                            p={12}
                            fz="sm"
                            bg="primary.1"
                          >
                            <EditableTextareaInput
                              id={id}
                              text={description}
                              onChange={updateActivityDescription}
                            />
                          </Collapse>
                        </>
                      ),
                    )}
                  {locationItinerary.length > 0 && (
                    <Table.Tr
                      classNames={{ tr: "final-table-row" }}
                      fw="bold"
                      fz="sm"
                      bg="primary.2"
                      tt="capitalize"
                    >
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td
                        ta="right"
                        style={{
                          justifyContent: "flex-end",
                        }}
                      >
                        Total itinerary cost
                      </Table.Td>
                      <Table.Td>{`R ${sum(
                        locationItinerary.map(({ cost }) => Number(cost)),
                      )}`}</Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Flex>
          </Flex>
        )}
      </Container>
    </ProtectedRoute>
  );
};

export default LocationPage;
