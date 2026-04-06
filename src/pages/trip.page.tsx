import {
  Container,
  Title,
  TextInput,
  ActionIcon,
  Flex,
  Text,
  Box,
  Table,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { FaHouse, FaPen, FaCheck, FaX, FaEye } from "react-icons/fa6";

import {
  Breadcrumbs,
  LinkButton,
  AddLocationModal,
  RemoveLocationModal,
  EditableDateInput,
  EditableSelect,
  ExportModal,
  ProtectedRoute,
} from "components";
import { useDBStore, useTrip } from "db";
import logger from "utils/logger";
import type { SavedHotel } from "types";
import type { FirestoreError } from "firebase/firestore";
import { workingSumDays } from "utils/sum-days";
import { sum } from "utils/sum";
import { editLocationDate, editLocationHotel } from "api/location";
import { editTripName } from "api/trip";
import { LocationsTableHeader } from "constants/headers";

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

const TripPage = () => {
  const { tripId } = useParams();

  const locations = useDBStore((state) => state.locations);

  useEffect(() => {
    if (!tripId) return;
  }, [tripId]);

  const trip = useTrip(tripId);

  const tripLocations = useMemo(() => {
    return locations.filter((location) => location.tripId === tripId);
  }, [locations, tripId]);

  const totalNights = useMemo(() => {
    return sum(tripLocations.map(({ nights }) => nights));
  }, [tripLocations]);

  const totalWorkingDays = useMemo(() => {
    if (trip) {
      return workingSumDays(trip.start_date, trip.end_date);
    }

    return 0;
  }, [trip]);

  if (!tripId || !trip) return null;

  const items = [
    { title: "Home", to: "/", icon: <FaHouse /> },
    { title: "Trip", to: "/trip" },
    { title: trip ? trip.name : "", to: `/trip/${tripId}` },
  ];

  const updateTripName = async (name: string) => {
    try {
      await editTripName(tripId, name);
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
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateLocationDate = async (id: string, date: string, start = true) => {
    try {
      await editLocationDate(id, trip, date, start);
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
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const updateLocationHotel = async (
    id: string,
    accommodation?: SavedHotel,
  ) => {
    try {
      await editLocationHotel(id, tripId, accommodation);
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
                <Flex gap={8}>
                  <AddLocationModal trip={trip} />
                  <ExportModal tripId={trip.id} />
                </Flex>
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
                  {LocationsTableHeader.map(({ id, label }) => (
                    <Table.Th key={`table-header-${id}`} fw={600}>
                      {label}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tripLocations
                  .sort(
                    (a, b) =>
                      dayjs(a.start_date).valueOf() -
                      dayjs(b.start_date).valueOf(),
                  )
                  .map(
                    (
                      { id, city, start_date, end_date, accommodation, nights },
                      index,
                    ) => (
                      <Table.Tr
                        key={`table-row-${id}`}
                        bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                      >
                        <Table.Td tt="capitalize" fz="sm" mt="0.5rem">
                          {city}
                        </Table.Td>
                        <Table.Td maw="15%">
                          <EditableDateInput
                            id={id}
                            date={start_date}
                            start
                            onChange={updateLocationDate}
                          />
                        </Table.Td>
                        <Table.Td>
                          <EditableDateInput
                            id={id}
                            date={end_date}
                            start={false}
                            onChange={updateLocationDate}
                          />
                        </Table.Td>
                        <Table.Td>
                          <EditableSelect
                            id={id}
                            city={city}
                            onChange={updateLocationHotel}
                            accommodation={accommodation}
                          />
                        </Table.Td>
                        <Table.Td fz="sm" my="auto">
                          {nights}
                        </Table.Td>
                        <Table.Td>
                          <LinkButton
                            w="100%"
                            my="auto"
                            color="green.4"
                            to={`/trip/${tripId}/location/${id}`}
                          >
                            <FaEye /> View
                          </LinkButton>
                        </Table.Td>
                        <Table.Td>
                          {trip.locations.length > 1 && (
                            <RemoveLocationModal
                              tripId={tripId}
                              locationId={id}
                            />
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ),
                  )}
                {tripLocations.length > 0 && (
                  <>
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
                        Total number of nights
                      </Table.Td>
                      <Table.Td>{totalNights}</Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                    <Table.Tr fw="bold" fz="sm" bg="primary.2" tt="capitalize">
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td ta="right">
                        Total number of working days
                      </Table.Td>
                      <Table.Td>{totalWorkingDays}</Table.Td>
                      <Table.Td></Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  </>
                )}
              </Table.Tbody>
            </Table>
          </Flex>
        </Flex>
      </Container>
    </ProtectedRoute>
  );
};

export default TripPage;
