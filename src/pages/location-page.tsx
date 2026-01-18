import {
  Container,
  Title,
  Flex,
  Text,
  Box,
  Select,
  ActionIcon,
  Collapse,
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
} from "components";
import { useDBStore, useLocation, useTrip } from "db/store";
import { db } from "db";
import logger from "utils/logger";
import { type DexieError } from "dexie";
import { ALL_HOTELS } from "constants/hotels";
import { useState } from "react";
import { sum } from "utils/sum";

const getColumnStyle = (last = false) => {
  return {
    borderBottom: "1px solid #000",
    borderRight: last ? "" : "1px solid #000",
    textTransform: "capitalize",
    padding: "8px 16px",
    display: "flex",
  };
};

const GridHeader = [
  {
    id: "collapse",
    style: getColumnStyle(),
    label: "",
  },
  {
    id: "item",
    style: getColumnStyle(),
    label: "",
  },
  {
    id: "date",
    style: getColumnStyle(),
    label: "Date",
  },
  {
    id: "activity",
    style: getColumnStyle(),
    label: "Activity",
  },
  {
    id: "time",
    style: getColumnStyle(),
    label: "Time",
  },
  {
    id: "link",
    style: getColumnStyle(),
    label: "Link",
  },
  {
    id: "cost",
    style: getColumnStyle(),
    label: "Cost",
  },
  {
    id: "duration",
    style: getColumnStyle(),
    label: "Duration",
  },
  {
    id: "remove",
    style: getColumnStyle(true),
    label: "",
  },
];

const LocationPage = () => {
  const [selectedCollapse, setSelectedCollapse] = useState<string | null>(null);

  const { tripId, locationId } = useParams();

  const { updateLocation, updateActivity, itinerary, currency } = useDBStore(
    (state) => state,
  );

  const trip = useTrip(tripId);
  const location = useLocation(locationId);
  const locationItinerary = itinerary.filter(
    (itinerary) => itinerary.locationId === locationId,
  );

  if (tripId === undefined || !trip) return null;
  if (locationId === undefined || !location) return null;

  const getAccommodations = () => {
    if (location) {
      const hotels = ALL_HOTELS.find(({ type }) => type === location.city);
      if (hotels) {
        return hotels.hotels;
      }
      return [];
    }
    return [];
  };

  const items = [
    { title: "Home", to: "/", icon: <FaHouse /> },
    { title: "Trip", to: "/trip" },
    { title: trip.name, to: `/trip/${tripId}` },
    {
      title: location.city,
      to: `/trip/${tripId}/location/${locationId}`,
    },
  ];

  const updateLocationHotel = async (hotel: string | null) => {
    const accommodation = hotel
      ? getAccommodations().find(({ name }) => name === hotel)
      : undefined;
    try {
      if (accommodation) {
        await db.locations.where({ id: locationId }).modify({
          accommodation,
        });
        updateLocation(locationId, {
          accommodation,
        });
        logger.info("Location accommodation was updated.");
        showNotification({
          message: "Location accommodation updated.",
          color: "green.7",
          icon: <FaCheck />,
        });
      }
    } catch (error) {
      logger.error("Location accommodation was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityDate = async (id: string, date: string) => {
    try {
      await db.itinerary.where({ id }).modify({ date });
      updateActivity(id, { date });
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
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateItineraryLink = async (id: string, link: string) => {
    try {
      await db.itinerary.where({ id }).modify({ link });
      updateActivity(id, { link });
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
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateItineraryActivity = async (id: string, activity: string) => {
    try {
      await db.itinerary.where({ id }).modify({ activity });
      updateActivity(id, { activity });
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
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityCost = async (id: string, cost: string | number) => {
    try {
      await db.itinerary.where({ id }).modify({ cost });
      updateActivity(id, { cost });

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
        message: (error as DexieError).message,
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
      await db.itinerary.where({ id }).modify({ duration: Number(duration) });
      updateActivity(id, { duration: Number(duration) });
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
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityTime = async (id: string, time: string) => {
    try {
      await db.itinerary.where({ id }).modify({ time });
      updateActivity(id, { time });
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
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateActivityDescription = async (id: string, description: string) => {
    try {
      await db.itinerary.where({ id }).modify({ description });
      updateActivity(id, { description });
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
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  return (
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
                value={location.accommodation?.name}
                data={getAccommodations().map(({ name }) => name)}
                onChange={updateLocationHotel}
                size="sm"
                searchable
                clearable={false}
                rightSection={<FaChevronDown size="0.75rem" color="#000" />}
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

                <AddActivityModal location={location} />
              </Flex>
            </Box>
            <Box>
              <Flex
                bg="primary.3"
                bd="6px solid #000"
                bdrs={12}
                w="100%"
                h="calc(100vh - 19rem)"
                direction="column"
              >
                <Box
                  display="grid"
                  w="100%"
                  bg="#fff"
                  style={{
                    gridTemplateColumns:
                      "3% 4% 15.33% 15.33% 9.66% 26% 10.33% 10.33% 6%",
                  }}
                >
                  {GridHeader.map(({ id, label, style }) => (
                    <Box key={`table-header-${id}`} style={style} fw={600}>
                      {label}
                    </Box>
                  ))}
                </Box>
                {locationItinerary
                  .sort(
                    (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
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
                        <Box
                          key={`table-row-${id}`}
                          display="grid"
                          w="100%"
                          fz="sm"
                          bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                          style={{
                            gridTemplateColumns:
                              "3% 4% 15.33% 15.33% 9.66% 26% 10.33% 10.33% 6%",
                          }}
                        >
                          <Box
                            style={{
                              borderBottom: "1px solid #000",
                              borderRight: "1px solid #000",
                              padding: "8px",
                            }}
                          >
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
                          </Box>
                          <Box style={getColumnStyle()}>
                            <Text size="sm" mt="0.5rem" mx="auto">
                              {index + 1}
                            </Text>
                          </Box>
                          <EditableDateInput
                            id={id}
                            date={date}
                            start
                            onChange={updateActivityDate}
                          />
                          <EditableTextInput
                            id={id}
                            text={activity}
                            onChange={updateItineraryActivity}
                          />
                          <EditableTimeInput
                            id={id}
                            text={time}
                            onChange={updateActivityTime}
                          />
                          <EditableTextInput
                            id={id}
                            text={link}
                            onChange={updateItineraryLink}
                          />
                          <EditableNumberInput
                            id={id}
                            text={cost}
                            preText={`${currency} `}
                            onChange={updateActivityCost}
                          />
                          <EditableNumberInput
                            id={id}
                            text={duration}
                            postText="hours"
                            onChange={updateActivityDuration}
                          />
                          <Box style={getColumnStyle(true)}>
                            {locationItinerary.length > 1 && (
                              <RemoveActivityModal
                                locationId={locationId}
                                activityId={id}
                              />
                            )}
                          </Box>
                        </Box>
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
                  <Box
                    display="grid"
                    w="100%"
                    fz="sm"
                    bg="primary.2"
                    style={{
                      gridTemplateColumns: "73.34% 26.66%",
                    }}
                  >
                    <Box
                      style={{
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        padding: "8px 16px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text fw="bold" size="sm" my="auto" ta="right">
                        Total itinerary cost
                      </Text>
                    </Box>
                    <Box
                      style={{
                        textTransform: "capitalize",
                        borderBottom: "1px solid #000",
                        padding: "8px 16px",
                        display: "flex",
                      }}
                    >
                      <Text fw="bold" size="sm" my="auto">
                        {`R ${sum(
                          locationItinerary.map(({ cost }) => Number(cost)),
                        )}`}
                      </Text>
                    </Box>
                  </Box>
                )}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      )}
    </Container>
  );
};

export default LocationPage;
