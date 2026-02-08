import { Container, Title, Flex, Text, Box } from "@mantine/core";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { FaHouse } from "react-icons/fa6";

import { AddCostModal, Breadcrumbs } from "components";
import { useDBStore, useTrip, useTripBudget, useTripLocations } from "db/store";
import { sum } from "utils/sum";
import { calcDaysBetween } from "utils/calc-days-between";

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
    id: "Name",
    style: getColumnStyle(),
    label: "Name",
  },
  {
    id: "type",
    style: getColumnStyle(),
    label: "Type",
  },
  {
    id: "cost",
    style: getColumnStyle(),
    label: "Cost *",
  },
  {
    id: "timespan",
    style: getColumnStyle(),
    label: "Timespan (now - start)",
  },

  {
    id: "monthly",
    style: getColumnStyle(),
    label: "Monthly (cost / timespan) *",
  },
  {
    id: "remove",
    style: getColumnStyle(true),
    label: "",
  },
];

const BudgetPage = () => {
  const { tripId } = useParams();

  const { travels, itinerary, currency, rate } = useDBStore((state) => state);

  const trip = useTrip(tripId);
  const budget = useTripBudget(tripId);
  const tripLocations = useTripLocations(tripId);

  if (tripId === undefined || !trip || !budget) return null;

  const items = [
    { title: "Home", to: "/", icon: <FaHouse /> },
    { title: "Trip", to: "/trip" },
    { title: trip ? trip.name : "", to: `/trip/${tripId}` },
    {
      title: "Budget",
      to: `/trip/${tripId}/budget`,
    },
  ];

  const getBudgetMap = () => {
    const months = Math.floor(
      dayjs(trip.start_date).diff(dayjs(), "months", true),
    );
    const output: {
      name: string;
      type: "Accommodation" | "Itinerary" | "Buffer" | "Travel";
      cost: number;
      monthly: number;
      timespan: number;
      canRemove: boolean;
    }[] = [];

    if (budget.buffer !== 0) {
      output.push({
        name: "Buffer Total",
        type: "Buffer",
        cost: budget.buffer,
        monthly: Math.round(budget.buffer * 100) / 100,
        timespan: months,
        canRemove: true,
      });
    }

    travels
      .filter((travel) => travel.tripId === tripId)
      .map((travel) => {
        const travelMonths = Math.floor(
          dayjs(trip.start_date).diff(dayjs(), "months", true),
        );
        const timespan = travelMonths <= 6 ? travelMonths : travelMonths - 6;

        output.push({
          name: `${travel.carrier} ${travel.type}`,
          type: "Travel",
          cost: travel.cost,
          monthly: Math.round(travel.cost * 100) / 100,
          timespan,
          canRemove: true,
        });
      });

    tripLocations.map((loc) => {
      const locMonths = Math.floor(
        dayjs(loc.start_date).diff(dayjs(), "months", true),
      );
      if (loc.accommodation) {
        const cost = loc.nights * loc.accommodation.price;
        output.push({
          name: loc.accommodation.name,
          type: "Accommodation",
          cost: Math.round(cost * rate * 100) / 100,
          monthly: Math.round(((cost * rate) / locMonths) * 100) / 100,
          timespan: locMonths,
          canRemove: false,
        });
      }
      const activities =
        itinerary.filter((itinerary) => itinerary.locationId === loc.id) ?? [];
      if (activities.length > 0) {
        output.push({
          name: `${loc.city} ${dayjs(loc.start_date).format(
            "(DD MMM - ",
          )}${dayjs(loc.end_date).format("DD MMM)")}`,
          type: "Itinerary",
          cost: sum(activities.map(({ cost }) => Number(cost))),
          monthly:
            Math.round(
              (sum(activities.map(({ cost }) => Number(cost))) / months) * 100,
            ) / 100,
          timespan: months,
          canRemove: false,
        });
      }
    });

    return output;
  };

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
            <Box>
              <Flex
                bg="primary.3"
                bd="6px solid #000"
                bdrs={12}
                w="100%"
                h="calc(100vh - 16rem)"
                direction="column"
              >
                <Box
                  display="grid"
                  w="100%"
                  bg="#fff"
                  style={{
                    gridTemplateColumns: "21% 17% 19% 18% 18% 7%",
                  }}
                >
                  {GridHeader.map(({ id, label, style }) => (
                    <Box key={`table-header-${id}`} style={style} fw={600}>
                      {label}
                    </Box>
                  ))}
                </Box>
                {getBudgetMap().map(
                  ({ name, type, cost, monthly, timespan }, index) => (
                    <Box
                      display="grid"
                      w="100%"
                      fz="sm"
                      bg={index % 2 === 0 ? "purple.2" : "blue.2"}
                      style={{
                        gridTemplateColumns: "21% 17% 19% 18% 18% 7%",
                      }}
                    >
                      <Box style={getColumnStyle()}>
                        <Text size="sm" my="auto">
                          {name}
                        </Text>
                      </Box>
                      <Box style={getColumnStyle()}>
                        <Text size="sm" my="auto">
                          {type}
                        </Text>
                      </Box>
                      <Box style={getColumnStyle()}>
                        <Text size="sm" my="auto">
                          {`${currency} ${cost}`}
                        </Text>
                      </Box>
                      <Box style={getColumnStyle()}>
                        <Text size="sm" my="auto">
                          {`${timespan} months`}
                        </Text>
                      </Box>
                      <Box style={getColumnStyle()}>
                        <Text size="sm" my="auto">
                          {`${currency} ${monthly}`}
                        </Text>
                      </Box>
                      <Box style={getColumnStyle(true)}></Box>
                    </Box>
                  ),
                )}
                {getBudgetMap().length > 0 && (
                  <Box
                    display="grid"
                    w="100%"
                    fz="sm"
                    bg="primary.2"
                    style={{
                      gridTemplateColumns: "38% 37% 25%",
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
                        Total Cost
                      </Text>
                    </Box>
                    <Box
                      style={{
                        textTransform: "capitalize",
                        borderRight: "1px solid #000",
                        borderBottom: "1px solid #000",
                        padding: "8px 16px",
                        display: "flex",
                      }}
                    >
                      <Text fw="bold" size="sm" my="auto">
                        {`${currency} ${sum(getBudgetMap().map(({ cost }) => cost))}`}
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
                        {`${currency} ${sum(
                          getBudgetMap().map(({ monthly }) => monthly),
                        )}`}
                      </Text>
                    </Box>
                  </Box>
                )}
                <Box
                  display="grid"
                  w="100%"
                  fz="sm"
                  bg="primary.2"
                  style={{
                    gridTemplateColumns: "100%",
                  }}
                >
                  <Box
                    style={{
                      borderRight: "1px solid #000",
                      borderBottom: "1px solid #000",
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
