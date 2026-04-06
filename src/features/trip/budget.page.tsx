import { Container, Title, Flex, Text, Box, Table } from "@mantine/core";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FaCheck, FaHouse, FaX } from "react-icons/fa6";

import { AddCostModal, Breadcrumbs, EditableCostInput } from "components";
import { useDBStore, useTrip } from "db";
import { sum } from "utils/sum";
import { calcDaysBetween } from "utils/calc-days-between";
import { useMemo } from "react";
import { BudgetTableHeader } from "constants/headers";
import type { CostProps } from "types";
import { editLocationHotel } from "api/location";
import { showNotification } from "@mantine/notifications";
import type { DexieError } from "dexie";
import { saveHotelIfNotExists } from "api/hotel";
import { editBudget } from "api/budget";

const BudgetPage = () => {
  const { tripId } = useParams();

  const { itinerary, currency, rate, locations, budgets } = useDBStore(
    (state) => state,
  );

  const trip = useTrip(tripId);

  const budget = useMemo(() => {
    return budgets.find((bud) => bud.tripId === tripId);
  }, [budgets, tripId]);

  const tripLocations = useMemo(() => {
    return locations.filter((location) => location.tripId === tripId);
  }, [locations, tripId]);

  if (tripId === undefined || !trip || !budget) return null;

  const travelMonths = Math.floor(
    dayjs(trip.start_date).diff(dayjs(), "months", true),
  );

  const BUDGET_MAP = () => {
    const output = new Array<{
      name: string;
      type: "Accommodation" | "Itinerary" | "Buffer" | "Travel";
      id: string;
      cost: number;
      monthly: number;
      timespan: number;
      canRemove: boolean;
    }>();
    if (budget.buffer > 0) {
      output.push({
        name: "Buffer Total",
        type: "Buffer",
        cost: budget.buffer,
        monthly: Math.round(budget.buffer * 100) / 100,
        timespan: travelMonths,
        canRemove: true,
        id: budget.id,
      });
    }

    if (budget.travel.length > 0) {
      const timespan = travelMonths <= 6 ? travelMonths : travelMonths - 6;

      budget.travel.map((travel) => {
        output.push({
          name: `${travel.carrier} ${travel.type}`,
          type: "Travel",
          cost: travel.cost,
          monthly: Math.round(travel.cost * 100) / 100,
          timespan,
          canRemove: true,
          id: travel.id,
        });
      });
    }

    if (tripLocations.length > 0) {
      tripLocations.map((location) => {
        const locMonths = Math.floor(
          dayjs(location.start_date).diff(dayjs(), "months", true),
        );

        if (location.accommodation) {
          const cost = location.accommodation.price
            ? Number(location.accommodation.price)
            : 0;
          output.push({
            name: location.accommodation.name,
            type: "Accommodation",
            cost: Math.round(cost * rate * 100) / 100,
            monthly: Math.round(((cost * rate) / locMonths) * 100) / 100,
            timespan: locMonths,
            canRemove: false,
            id: location.id,
          });
        }

        const activities =
          itinerary.filter(
            (itinerary) => itinerary.locationId === location.id,
          ) ?? [];
        if (activities.length > 0) {
          output.push({
            name: `${location.city} ${dayjs(location.start_date).format(
              "(DD MMM - ",
            )}${dayjs(location.end_date).format("DD MMM)")}`,
            type: "Itinerary",
            cost: sum(activities.map(({ cost }) => Number(cost))),
            monthly:
              Math.round(
                (sum(activities.map(({ cost }) => Number(cost))) /
                  travelMonths) *
                  100,
              ) / 100,
            timespan: travelMonths,
            canRemove: false,
            id: "1",
          });
        }
      });
    }

    return output;
  };

  const editAccommodation = async (
    tripId: string,
    locationId: string,
    cost: string | number,
  ) => {
    const location = tripLocations.find(({ id }) => id === locationId);
    if (location && location.accommodation) {
      const hotel = { ...location.accommodation, price: cost };
      try {
        await editLocationHotel(locationId, tripId, hotel);
        await saveHotelIfNotExists(hotel);

        showNotification({
          message: "Accommodation price updated.",
          color: "green.7",
          icon: <FaCheck />,
        });
      } catch (error) {
        showNotification({
          title: "Something Went Wrong",
          message: (error as DexieError).message,
          color: "red",
          icon: <FaX />,
        });
      }
    }
  };

  const editBuffer = async (cost: string | number) => {
    try {
      await editBudget(budget.id, { buffer: Number(cost) });

      showNotification({
        message: "Accommodation price updated.",
        color: "green.7",
        icon: <FaCheck />,
      });
    } catch (error) {
      showNotification({
        title: "Something Went Wrong",
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const editTravel = async (travelId: string, cost: string | number) => {
    try {
      let travel = budget.travel.find(({ id }) => id === travelId);

      if (travel) {
        travel = { ...travel, cost: Number(cost) };
        const travels = [...budget.travel, travel];

        await editBudget(budget.id, { travel: travels });

        showNotification({
          message: "Accommodation price updated.",
          color: "green.7",
          icon: <FaCheck />,
        });
      }
    } catch (error) {
      showNotification({
        title: "Something Went Wrong",
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const editCosts = (
    tripId: string,
    id: string,
    text: string | number,
    type: CostProps,
  ) => {
    switch (type) {
      case "Accommodation": {
        editAccommodation(tripId, id, text);
        break;
      }
      case "Buffer": {
        editBuffer(text);
        break;
      }
      default: {
        editTravel(id, text);
        break;
      }
    }
  };

  const items = [
    { title: "Home", to: "/", icon: <FaHouse /> },
    { title: "Trip", to: "/trip" },
    { title: trip ? trip.name : "", to: `/trip/${tripId}` },
    {
      title: "Budget",
      to: `/trip/${tripId}/budget`,
    },
  ];

  return (
    <Container py={12} px={24} h="calc(100vh - 60px)" m={0} maw="100%">
      <Breadcrumbs items={items} />
      {trip && (
        <Flex direction="column" gap="lg">
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
                Budget
              </Title>
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
            <Flex justify="space-between">
              <Text fw={600} fz="md" my="auto">{`For ${trip.name}`}</Text>
            </Flex>
            <Flex fz="sm">
              <Text>{`${calcDaysBetween(
                trip.start_date,
                trip.end_date,
              )} nights`}</Text>
            </Flex>
          </Box>
          <Flex direction="column" gap={8}>
            <Box>
              <Flex justify="space-between">
                <Title my="auto" order={6}>
                  Budget Items
                </Title>
                <Flex gap={8}>
                  {!budget.buffer && (
                    <AddCostModal type="buffer" tripId={tripId} />
                  )}
                  <AddCostModal type="travel" tripId={tripId} />
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
                  {BudgetTableHeader.map(({ id, label }) => (
                    <Table.Th key={`table-header-${id}`} fw={600}>
                      {label}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {BUDGET_MAP().map(
                  ({ id, name, type, cost, monthly, timespan }, index) => (
                    <Table.Tr
                      key={`table-row-${index}`}
                      bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                    >
                      <Table.Td>
                        <Text tt="capitalize" fz="sm" mt="0.5rem">
                          {name}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text tt="capitalize" fz="sm" mt="0.5rem">
                          {type}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {type !== "Itinerary" ? (
                          <EditableCostInput
                            tripId={tripId}
                            id={id}
                            text={cost}
                            type={type}
                            preText={`${currency} `}
                            onChange={editCosts}
                          />
                        ) : (
                          <Text
                            tt="capitalize"
                            fz="sm"
                            mt="0.5rem"
                          >{`${currency} ${cost}`}</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text
                          tt="capitalize"
                          fz="sm"
                          mt="0.5rem"
                        >{`${timespan} months`}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          tt="capitalize"
                          fz="sm"
                          mt="0.5rem"
                        >{`${currency} ${monthly}`}</Text>
                      </Table.Td>
                      <Table.Td></Table.Td>
                    </Table.Tr>
                  ),
                )}
                {BUDGET_MAP().length > 0 && (
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
                      Total Cost
                    </Table.Td>
                    <Table.Td>{`${currency} ${sum(BUDGET_MAP().map(({ cost }) => cost))}`}</Table.Td>
                    <Table.Td>{`${currency} ${sum(
                      BUDGET_MAP().map(({ monthly }) => monthly),
                    )}`}</Table.Td>
                    <Table.Td></Table.Td>
                  </Table.Tr>
                )}
                <Table.Tr
                  classNames={{ tr: "final-table-row" }}
                  fw="bold"
                  fz="sm"
                  bg="primary.2"
                  tt="capitalize"
                >
                  <Table.Td></Table.Td>

                  <Table.Td
                    ta="right"
                    style={{
                      justifyContent: "flex-end",
                    }}
                  >
                    Total Cost
                  </Table.Td>
                  <Table.Td>{`${currency} ${sum(BUDGET_MAP().map(({ cost }) => cost))}`}</Table.Td>
                  <Table.Td></Table.Td>
                  <Table.Td>{`${currency} ${sum(
                    BUDGET_MAP().map(({ monthly }) => monthly),
                  )}`}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
            <Box>
              <Flex w="100%" direction="column">
                <Box display="grid" w="100%" fz="sm">
                  <Box
                    style={{
                      padding: "8px 16px",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 4,
                    }}
                  >
                    <Text size="sm" my="auto" ta="right">
                      *{" "}
                      <b>
                        Only accommodation costs are automatically converted
                        when you change the currency.
                      </b>{" "}
                      Other budget items are entered manually and remain
                      unchanged.
                    </Text>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      )}
    </Container>
  );
};

export default BudgetPage;
