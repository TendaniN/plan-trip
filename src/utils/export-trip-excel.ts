import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { sum } from "./sum";
import { workingSumDays } from "./sum-days";
import type { Budget, Location, Trip } from "types";
import { useDBStore } from "db";

const summarySheet = (
  locations: Location[],
  trip: Trip,
  workbook: XLSX.WorkBook,
) => {
  const header = ["Country", "Location", "Arrive", "Depart", "Nights"];

  const locationJSON: unknown[] = locations
    .sort(
      (a, b) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf(),
    )
    .map((location) => {
      return {
        Country: location.country,
        Location: location.city,
        Arrive: location.start_date,
        Depart: location.end_date,
        Nights: location.nights,
      };
    });

  const ws = XLSX.utils.json_to_sheet(locationJSON, { header });

  XLSX.utils.sheet_add_json(
    ws,
    [
      {},
      {},
      {
        Country: "Total number of nights",
        Location: sum(locations.map(({ nights }) => nights)),
      },
      {
        Country: "Total number of working days",
        Location: workingSumDays(trip.start_date, trip.end_date),
      },
    ],
    { skipHeader: true, origin: -1 },
  );
  XLSX.utils.book_append_sheet(workbook, ws, "Summary");
};

const locationSheet = async (location: Location, workbook: XLSX.WorkBook) => {
  const { itinerary, currency } = useDBStore.getState();

  const header = [
    "",
    "Date",
    "Activity",
    "Time",
    `Cost (in ${currency})`,
    "Duration (in hrs)",
    "Link",
  ];

  const itineraryJSON = itinerary
    .filter(({ locationId }) => locationId === location.id)
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .map((activity, index) => [
      index + 1,
      dayjs(activity.date).format("ddd, DD MMMM YYYY"),
      activity.activity,
      activity.time,
      activity.cost,
      activity.duration,
      activity.link,
    ]);

  const prependRows = [
    ["City", location.city],
    ["Arrive", dayjs(location.start_date).format("ddd, DD MMMM YYYY")],
    ["Depart", dayjs(location.end_date).format("ddd, DD MMMM YYYY")],
    ["Nights", location.nights],
    ["Hotel", location.accommodation ? location.accommodation.name : ""],
    [],
    ["Itinerary"],
  ];

  const finalAOA = [...prependRows, header, ...itineraryJSON];

  const ws = XLSX.utils.aoa_to_sheet(finalAOA);

  XLSX.utils.book_append_sheet(workbook, ws, `${location.city} Itinerary`);
};

const budgetSheet = async (
  budget: Budget,
  trip: Trip,
  locations: Location[],
  workbook: XLSX.WorkBook,
) => {
  const header = [
    "Name",
    "Type",
    "Cost",
    "Timespan (now - departure)",
    "Monthly (cost / timespan)",
  ];

  const months = Math.floor(
    dayjs(trip.start_date).diff(dayjs(), "months", true),
  );

  const { itinerary, rate, currency } = useDBStore.getState();

  const budgetJSON = [];

  if (budget.buffer > 0) {
    budgetJSON.push({
      Name: "Buffer Total",
      Type: "Buffer",
      Cost: budget.buffer,
      "Monthly (cost / timespan)":
        Math.round((budget.buffer / months) * 100) / 100,
      "Timespan (now - departure)": months,
    });
  }

  if (budget.travel.length > 0) {
    const timespan = months <= 6 ? months : months - 6;

    budget.travel.map((travel) => {
      budgetJSON.push({
        Name: `${travel.carrier} ${travel.type}`,
        Type: "Travel",
        Cost: travel.cost,
        "Monthly (cost / timespan)":
          Math.round((travel.cost / timespan) * 100) / 100,
        "Timespan (now - departure)": timespan,
      });
    });
  }

  if (locations.length > 0) {
    locations.map((loc) => {
      const locMonths = Math.floor(
        dayjs(loc.start_date).diff(dayjs(), "months", true),
      );
      if (loc.accommodation) {
        const cost = loc.accommodation.price
          ? Number(loc.accommodation.price)
          : 0;
        budgetJSON.push({
          Name: loc.accommodation.name,
          Type: "Accommodation",
          Cost: Math.round(cost * rate * 100) / 100,
          "Monthly (cost / timespan)":
            Math.round(((cost * rate) / locMonths) * 100) / 100,
          "Timespan (now - departure)": locMonths,
        });
      }
      const activities =
        itinerary.filter((itinerary) => itinerary.locationId === loc.id) ?? [];
      if (activities.length > 0) {
        budgetJSON.push({
          Name: `${loc.city} ${dayjs(loc.start_date).format(
            "(DD MMM - ",
          )}${dayjs(loc.end_date).format("DD MMM)")}`,
          Type: "Itinerary",
          Cost: sum(activities.map(({ cost }) => Number(cost))),
          "Monthly (cost / timespan)":
            Math.round(
              (sum(activities.map(({ cost }) => Number(cost))) / months) * 100,
            ) / 100,
          "Timespan (now - departure)": months,
        });
      }
    });
  }

  const ws = XLSX.utils.json_to_sheet(budgetJSON, { header });

  XLSX.utils.sheet_add_json(
    ws,
    [
      {},
      {
        Name: "Total cost",
        Type: "",
        Cost: `${currency} ${sum(budgetJSON.map(({ Cost }) => Cost))}`,
        "Timespan (now - departure)": "",
        "Monthly (cost / timespan)": `${currency} ${sum(
          budgetJSON.map((budget) => budget["Monthly (cost / timespan)"]),
        )}`,
      },
    ],
    { skipHeader: true, origin: -1 },
  );
  XLSX.utils.book_append_sheet(workbook, ws, "Budget Planning");
};

export const exportTripExcel = async (
  tripId: string,
  values: {
    summary: boolean;
    location: boolean;
    accommodation: boolean;
    budget: boolean;
  },
) => {
  const { trips, locations, budgets } = useDBStore.getState();

  const trip = trips.find(({ id }) => id === tripId) ?? null;
  const tripLocations = locations.filter((loc) => loc.tripId === tripId);
  const tripBudget = budgets.find((budget) => budget.tripId === tripId);

  if (!trip) return;

  const workbook = XLSX.utils.book_new();

  summarySheet(tripLocations, trip, workbook);

  if (values.location || values.accommodation) {
    for (const location of tripLocations) {
      locationSheet(location, workbook);
    }
  }

  if (values.budget && tripBudget) {
    budgetSheet(tripBudget, trip, tripLocations, workbook);
  }

  XLSX.writeFile(workbook, `${trip.name}.xlsx`);
};
