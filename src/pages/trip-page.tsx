import {
  Container,
  Title,
  TextInput,
  ActionIcon,
  Flex,
  Text,
  Box,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import { FaHouse, FaPen, FaCheck, FaX, FaEye } from "react-icons/fa6";

import {
  Breadcrumbs,
  LinkButton,
  AddLocationModal,
  RemoveLocationModal,
  EditableDateInput,
  EditableSelect,
} from "components";
import { useDBStore } from "db/store";
import { db } from "db";
import logger from "utils/logger";
import { calcDaysBetween } from "utils/calc-days-between";
import type { HotelProps } from "types/hotel";
import { type DexieError } from "dexie";

interface Props {
  id: string;
  initialText?: string;
  onSave: (text: string) => void;
}

const EditableTitle = ({ initialText = "", onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(text);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return isEditing ? (
    <TextInput
      value={text}
      my="auto"
      w="50%"
      onChange={(e) => setText(e.target.value)}
      autoFocus
      size="md"
      rightSectionWidth={60}
      rightSectionPointerEvents="all"
      rightSection={
        <Flex gap={4}>
          <ActionIcon
            variant="light"
            color="green.8"
            aria-label="Save"
            size="sm"
            onClick={handleSave}
          >
            <FaCheck />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            aria-label="Cancel"
            size="sm"
            onClick={handleCancel}
          >
            <FaX />
          </ActionIcon>
        </Flex>
      }
    />
  ) : (
    <Title
      my="auto"
      order={2}
      onClick={handleEdit}
      display="flex"
      style={{ cursor: "pointer", gap: "0.5rem" }}
    >
      {text}
      <ActionIcon variant="light" color="blue.8" my="auto" aria-label="Edit">
        <FaPen size="1rem" style={{ margin: "auto 0" }} />
      </ActionIcon>
    </Title>
  );
};

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
    id: "city",
    style: getColumnStyle(),
    label: "City",
  },
  {
    id: "arrive",
    style: getColumnStyle(),
    label: "Arrive",
  },
  {
    id: "depart",
    style: getColumnStyle(),
    label: "Depart",
  },
  {
    id: "accommodation",
    style: getColumnStyle(),
    label: "Accommodation",
  },
  {
    id: "nights",
    style: getColumnStyle(),
    label: "Nights",
  },
  {
    id: "button",
    style: getColumnStyle(),
    label: "",
  },
  {
    id: "remove",
    style: getColumnStyle(true),
    label: "",
  },
];

const TripPage = () => {
  const { tripId } = useParams();

  const {
    trips,
    locations,
    id,
    updateTrip,
    updateLocation,
    budgets,
    updateBudget,
  } = useDBStore((state) => state);

  if (tripId === undefined) return null;

  const trip = tripId ? trips.find((trip) => trip.id === tripId) : null;

  const tripLocations = tripId
    ? locations.filter((location) => location.tripId === tripId)
    : [];

  const currentBudget = budgets.filter((budget) => budget.tripId === tripId)[0];

  const items = [
    { title: "Home", to: "/", icon: <FaHouse /> },
    { title: "Trip", to: "/trip" },
    { title: trip ? trip.name : "", to: `/trip/${tripId}` },
  ];

  const updateTripName = async (name: string) => {
    try {
      await db.trips.where({ id: tripId, userId: id }).modify({ name });
      updateTrip(tripId, { name });
      logger.info("Trip name was updated.");
      showNotification({
        message: "Trip name updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      logger.error("Trip name was not updated:", error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateLocationDate = async (id: string, date: string, start = true) => {
    try {
      const location = tripLocations.filter((loc) => loc.id === id);
      const nights = calcDaysBetween(
        start ? date : location[0].start_date,
        start ? location[0].end_date : date
      );
      const change = start
        ? { start_date: date, nights }
        : { end_date: date, nights };
      await db.locations.where({ id }).modify(change);
      updateLocation(id, change);
      logger.info("Location date was updated.");
      showNotification({
        message: "Location date was updated.",
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

  const updateLocationHotel = async (
    id: string,
    accommodation?: HotelProps
  ) => {
    try {
      if (accommodation) {
        const currentHotel =
          tripLocations.find((loc) => loc.id === id)?.accommodation ?? null;
        if (currentHotel) {
          await db.budgets.update(currentBudget.id, {
            accommodation: currentBudget.accommodation.filter(
              (budget) => budget.name !== currentHotel.name
            ),
          });
          updateBudget(currentBudget.id, {
            accommodation: currentBudget.accommodation.filter(
              (budget) => budget.name !== currentHotel.name
            ),
          });
        }
        await db.budgets.update(currentBudget.id, {
          accommodation: [...currentBudget.accommodation, accommodation],
        });
        updateBudget(currentBudget.id, {
          accommodation: [...currentBudget.accommodation, accommodation],
        });
      }
      await db.locations.where({ id }).modify({ accommodation });
      updateLocation(id, { accommodation });
      logger.info("Location accommodation was updated.");
      showNotification({
        message: "Location accommodation was updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
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

  return (
    <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
      <Breadcrumbs items={items} />
      {trip && (
        <Flex direction="column" gap="xl">
          <Box>
            <Flex justify="space-between">
              <EditableTitle
                id="title"
                initialText={trip.name}
                onSave={updateTripName}
              />
              <Flex direction="column" my="auto">
                <Text size="sm">
                  <b style={{ marginRight: "0.5rem" }}>Start:</b>
                  {dayjs(trip.start_date).format("dddd, DD MMM YYYY")}
                </Text>
                <Text size="sm">
                  <b style={{ marginRight: "0.5rem" }}>End:</b>
                  {dayjs(trip.end_date).format("dddd, DD MMM YYYY")}
                </Text>
              </Flex>
            </Flex>
            <Flex fz="sm">
              <Link to={`/trip/${tripId}/budget`}>View Trip Budget</Link>
            </Flex>
          </Box>
          <Flex direction="column" gap={8}>
            <Box>
              <Flex justify="space-between">
                <Title my="auto" order={6}>
                  Locations
                </Title>
                <AddLocationModal trip={trip} />
              </Flex>
            </Box>
            <Box>
              <Flex
                bg="primary-3"
                bd="6px solid #000"
                bdrs={12}
                w="100%"
                direction="column"
              >
                <Box
                  display="grid"
                  w="100%"
                  bg="#fff"
                  style={{
                    gridTemplateColumns: "15% 15% 15% 24% 9% 15% 7%",
                  }}
                >
                  {GridHeader.map(({ id, label, style }) => (
                    <Box key={`table-header-${id}`} style={style} fw={600}>
                      {label}
                    </Box>
                  ))}
                </Box>
                {tripLocations
                  .sort(
                    (a, b) =>
                      dayjs(a.start_date).valueOf() -
                      dayjs(b.start_date).valueOf()
                  )
                  .map(
                    (
                      { id, city, start_date, end_date, accommodation, nights },
                      index
                    ) => (
                      <Box
                        key={`table-row-${id}`}
                        display="grid"
                        w="100%"
                        fz="sm"
                        bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                        style={{
                          gridTemplateColumns: "15% 15% 15% 24% 9% 15% 7%",
                        }}
                      >
                        <Box style={getColumnStyle()}>
                          <Text size="sm" mt="0.5rem">
                            {city}
                          </Text>
                        </Box>
                        <EditableDateInput
                          id={id}
                          date={start_date}
                          start
                          onChange={updateLocationDate}
                        />
                        <EditableDateInput
                          id={id}
                          date={end_date}
                          start={false}
                          onChange={updateLocationDate}
                        />
                        <EditableSelect
                          id={id}
                          city={city}
                          onChange={updateLocationHotel}
                          accommodation={accommodation}
                        />
                        <Box style={getColumnStyle()}>
                          <Text size="sm" my="auto">
                            {nights}
                          </Text>
                        </Box>
                        <Box style={getColumnStyle()}>
                          <LinkButton
                            w="100%"
                            my="auto"
                            color="green.4"
                            to={`/trip/${tripId}/location/${id}`}
                          >
                            <FaEye /> View
                          </LinkButton>
                        </Box>
                        <Box style={getColumnStyle(true)}>
                          {trip.locations.length > 1 && (
                            <RemoveLocationModal
                              tripId={tripId}
                              locationId={id}
                            />
                          )}
                        </Box>
                      </Box>
                    )
                  )}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      )}
    </Container>
  );
};

export default TripPage;
