import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { sum } from "./sum";
import { workingSumDays } from "./sum-days";
import type { Location, Trip } from "types/db";
import { useDBStore } from "db/store";

const summarySheet = (
  locations: Location[],
  trip: Trip,
  workbook: XLSX.WorkBook
) => {
  const header = ["Country", "Location", "Arrive", "Depart", "Nights"];

  const locationJSON: unknown[] = locations
    .sort(
      (a, b) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf()
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
    { skipHeader: true, origin: -1 }
  );
  ws["!cols"] = header.map(() => ({ wch: 20 }));
  XLSX.utils.book_append_sheet(workbook, ws, "Summary");
};

const locationSheet = async (location: Location, workbook: XLSX.WorkBook) => {
  const header = [
    "",
    "Date",
    "Activity",
    "Time",
    "Cost (in R)",
    "Duration (in hrs)",
    "Link",
  ];
  const { itinerary } = useDBStore.getState();

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
  ws["!cols"] = header.map(() => ({ wch: 20 }));

  XLSX.utils.book_append_sheet(workbook, ws, `${location.city} Itinerary`);
};

export const exportTripExcel = async (tripId: string) => {
  const { trips, locations } = useDBStore.getState();

  const trip = trips.find(({ id }) => id === tripId) ?? null;

  if (!trip) return;

  const workbook = XLSX.utils.book_new();

  summarySheet(locations, trip, workbook);

  for (const location of locations) {
    locationSheet(location, workbook);
  }

  XLSX.writeFile(workbook, `${trip.name}.xlsx`);
};
