import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { sum } from "./sum";
import { workingSumDays } from "./sum-days";
import type { Budget, Location, Trip } from "types/db";
import { useDBStore } from "db/store";
import { ALL_HOTELS } from "constants/hotels";

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

const accommodationSheet = async (
  location: Location,
  workbook: XLSX.WorkBook,
) => {
  const { currency, rate } = useDBStore.getState();

  const hotels = ALL_HOTELS.find(({ type }) => type === location.city);
  let hotelJSON: unknown[] = [];

  if (hotels) {
    hotelJSON = hotels.hotels.map((hotel, index) => [
      index + 1,
      hotel.name,
      hotel.area,
      hotel.room.title,
      hotel.rating.booking,
      hotel.rating.google,

      Math.round(((hotel.rating.booking + hotel.rating.google) / 15) * 500) /
        100,
      Math.round(hotel.price * location.nights * rate * 100) / 100,
      hotel.link,
      hotel.stars,
      hotel.breakfast,
    ]);
  }

  const hotelAOA: unknown[][] = [
    [
      "#",
      "Name",
      "Area",
      "Room",
      "Ratings",
      "",
      "",
      `Cost (in ${currency})`,
      "Link",
      "Stars",
      "Breakfast Included",
    ],
    ["", "", "", "", "Booking", "Google", "Average", "", "", "", ""],
  ];

  const ws = XLSX.utils.aoa_to_sheet(hotelAOA.concat(hotelJSON));
  hotelJSON.forEach((_, i) => {
    const row = i + 3;
    const cellRef = `H${row}`;

    if (ws[cellRef]) {
      ws[cellRef].z = `${currency}#,##0.00`;
    }
  });

  ws["!merges"] = [
    {
      s: { r: 0, c: 4 },
      e: { r: 0, c: 6 },
    },
    {
      s: { r: 0, c: 0 },
      e: { r: 1, c: 0 },
    },
    {
      s: { r: 0, c: 1 },
      e: { r: 1, c: 1 },
    },
    {
      s: { r: 0, c: 2 },
      e: { r: 1, c: 2 },
    },
    {
      s: { r: 0, c: 3 },
      e: { r: 1, c: 3 },
    },
    {
      s: { r: 0, c: 7 },
      e: { r: 1, c: 7 },
    },
    {
      s: { r: 0, c: 8 },
      e: { r: 1, c: 8 },
    },
    {
      s: { r: 0, c: 9 },
      e: { r: 1, c: 9 },
    },
    {
      s: { r: 0, c: 10 },
      e: { r: 1, c: 10 },
    },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    ws,
    `Accommodation in ${location.city}`,
  );
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

  const { travels, itinerary, rate, currency } = useDBStore.getState();

  const budgetJSON = [
    {
      Name: "Buffer Total",
      Type: "Buffer",
      Cost: budget.buffer,
      "Monthly (cost / timespan)":
        Math.round((budget.buffer / months) * 100) / 100,
      "Timespan (now - departure)": months,
    },
  ];

  budget.travel.map((travelId) => {
    const travel = travels.filter(({ id }) => id === travelId)[0];
    const travelMonths = Math.floor(
      dayjs(trip.start_date).diff(dayjs(), "months", true),
    );
    const timespan = travelMonths <= 6 ? travelMonths : travelMonths - 6;

    budgetJSON.push({
      Name: `${travel.carrier} ${travel.type}`,
      Type: "Travel",
      Cost: travel.cost,
      "Monthly (cost / timespan)":
        Math.round((travel.cost / timespan) * 100) / 100,
      "Timespan (now - departure)": timespan,
    });
  });

  locations.map((loc) => {
    const locMonths = Math.floor(
      dayjs(loc.start_date).diff(dayjs(), "months", true),
    );
    if (loc.accommodation) {
      const cost = loc.nights * loc.accommodation.price;
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
      if (values.location) {
        locationSheet(location, workbook);
      }
      if (values.accommodation) {
        accommodationSheet(location, workbook);
      }
    }
  }

  if (values.budget && tripBudget) {
    budgetSheet(tripBudget, trip, tripLocations, workbook);
  }

  XLSX.writeFile(workbook, `${trip.name}.xlsx`);
};
