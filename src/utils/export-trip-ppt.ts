import PptxGenJS from "pptxgenjs";
import { useDBStore } from "db";
import dayjs from "dayjs";
import { workingSumDays } from "./sum-days";
import { sum } from "./sum";
import type { Budget, Location, Trip } from "types";

const buildSummarySlide = (
  pptx: PptxGenJS,
  trip: Trip,
  locations: Location[],
) => {
  const slide = pptx.addSlide();
  slide.addText(
    [
      { text: "Total number of nights: ", options: { bold: true } },
      { text: String(sum(locations.map((l) => l.nights))) },
    ],
    { x: 0.5, y: 0.5, w: 9, align: "center", fontSize: 14 },
  );

  slide.addText(
    [
      { text: "Total number of working days: ", options: { bold: true } },
      {
        text: String(workingSumDays(trip.start_date, trip.end_date)),
      },
    ],
    { x: 0.5, y: 0.8, w: 9, align: "center", fontSize: 14 },
  );

  let cursorY = 1.2;

  locations.forEach((l) => {
    // Country header
    slide.addText(l.country, {
      x: 0.5,
      y: cursorY,
      fontSize: 16,
      bold: true,
    });

    cursorY += 0.3;

    // Left column
    slide.addText(
      [{ text: "City: ", options: { bold: true } }, { text: l.city }],
      {
        x: 0.5,
        y: cursorY,
        w: 4.5,
        fontSize: 12,
        bullet: true,
      },
    );
    cursorY += 0.25;

    slide.addText(
      [
        { text: "Nights: ", options: { bold: true } },
        { text: String(l.nights) },
      ],
      {
        x: 0.5,
        y: cursorY,
        w: 4.5,
        fontSize: 12,
        bullet: true,
      },
    );
    cursorY += 0.25;
    slide.addText(
      [
        { text: "Hotel: ", options: { bold: true } },
        {
          text: l.accommodation?.name ?? "-",
          options: {
            hyperlink: {
              url: l.accommodation?.link ? l.accommodation.link : "-",
            },
            color: l.accommodation ? "0000FF" : undefined,
            underline: {
              style: l.accommodation ? "dashLong" : undefined,
            },
          },
        },
      ],
      {
        x: 0.5,
        y: cursorY,
        w: 4.5,
        fontSize: 12,
        bullet: true,
      },
    );
    cursorY += 0.35;

    // Right column
    slide.addText(
      [
        { text: "Arrive: ", options: { bold: true } },
        {
          text: dayjs(l.start_date).format("dddd, DD MMMM YYYY"),
        },
      ],
      {
        x: 5.2,
        y: cursorY - 0.85,
        w: 4.3,
        fontSize: 12,
        bullet: true,
      },
    );
    slide.addText(
      [
        { text: "Depart: ", options: { bold: true } },
        {
          text: dayjs(l.end_date).format("dddd, DD MMMM YYYY"),
        },
      ],
      {
        x: 5.2,
        y: cursorY - 0.85 + 0.25,
        w: 4.3,
        fontSize: 12,
        bullet: true,
      },
    );
    cursorY += 0.25;
  });
};

const buildLocationSlide = (pptx: PptxGenJS, location: Location) => {
  const slide = pptx.addSlide();

  const { itinerary, currency } = useDBStore.getState();

  // Title
  slide.addText(location.city, {
    x: 0.5,
    y: 0.3,
    fontSize: 24,
    bold: true,
  });

  // Slide header
  slide.addText(
    [
      { text: "Arrive: ", options: { bold: true } },
      { text: dayjs(location.start_date).format("DD MMM YYYY") },
    ],
    { x: 0.5, y: 0.9, fontSize: 12 },
  );

  slide.addText(
    [
      { text: "Depart: ", options: { bold: true } },
      { text: dayjs(location.end_date).format("DD MMM YYYY") },
    ],
    { x: 5.5, y: 0.9, fontSize: 12 },
  );

  slide.addText(
    [
      { text: "Nights: ", options: { bold: true } },
      { text: String(location.nights) },
    ],
    { x: 0.5, y: 1.15, fontSize: 12 },
  );

  slide.addText(
    [
      { text: "Hotel: ", options: { bold: true } },
      { text: location.accommodation?.name ?? "-" },
    ],
    { x: 5.5, y: 1.15, fontSize: 12 },
  );

  // Table data
  const itineraryRows = itinerary
    .filter(({ locationId }) => locationId === location.id)
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .map((activity) => [
      { text: dayjs(activity.date).format("ddd, DD MMM YYYY") },
      { text: activity.time },
      { text: activity.activity },
      { text: `${currency}${activity.cost}` },
      { text: String(activity.duration) },
      {
        text: "link",
        options: {
          hyperlink: activity.link ? { url: activity.link } : undefined,
          color: activity.link ? "0000FF" : "808080",
          underline: { style: "dashLong" as const },
        },
      },
    ]);

  slide.addTable(
    [
      [
        { text: "Date", options: { bold: true, align: "center" } },
        { text: "Time", options: { bold: true, align: "center" } },
        { text: "Activity", options: { bold: true, align: "center" } },
        {
          text: `Cost (${currency})`,
          options: { bold: true, align: "center" },
        },
        {
          text: "Duration (hrs)",
          options: { bold: true, align: "center" },
        },
        { text: "Link", options: { bold: true, align: "center" } },
      ],
      ...itineraryRows,
    ],
    {
      x: 0.25,
      y: 1.3,
      w: 9,
      colW: [1.8, 1, 3.4, 1.2, 1.2, 0.9],
      border: { type: "solid", color: "999999" },
      fontSize: 10,
      align: "center",
    },
  );
};

const buildBudgetSlide = (
  pptx: PptxGenJS,
  budget: Budget,
  trip: Trip,
  locations: Location[],
) => {
  const slide = pptx.addSlide();

  const { travels, itinerary, rate, currency } = useDBStore.getState();

  // Title
  slide.addText("Budget Plan", {
    x: 0.5,
    y: 0.3,
    fontSize: 24,
    bold: true,
  });

  const months = Math.floor(
    dayjs(trip.start_date).diff(dayjs(), "months", true),
  );

  // Table header
  const tableRows: PptxGenJS.TableRow[] = [
    [
      { text: "Name", options: { bold: true, align: "center" } },
      { text: "Type", options: { bold: true, align: "center" } },
      {
        text: `Cost (${currency})`,
        options: { bold: true, align: "center" },
      },
      {
        text: "Timespan (months)",
        options: { bold: true, align: "center" },
      },
      {
        text: "Monthly",
        options: { bold: true, align: "center" },
      },
    ],
  ];

  // Buffer row
  tableRows.push([
    { text: "Buffer Total" },
    { text: "Buffer" },
    {
      text: `${currency} ${budget.buffer}`,
      options: { align: "center" },
    },
    { text: String(months), options: { align: "center" } },
    {
      text: `${currency} ${Math.round((budget.buffer / months) * 100) / 100}`,
      options: { align: "center" },
    },
  ]);

  // Travel rows
  travels
    .filter(({ tripId }) => tripId === trip.id)
    .forEach((travel) => {
      const travelMonths = Math.floor(
        dayjs(trip.start_date).diff(dayjs(), "months", true),
      );
      const timespan = travelMonths <= 6 ? travelMonths : travelMonths - 6;

      tableRows.push([
        { text: `${travel.carrier} ${travel.type}` },
        { text: "Travel" },
        {
          text: `${currency} ${travel.cost}`,
          options: { align: "center" },
        },
        { text: String(timespan), options: { align: "center" } },
        {
          text: `${currency} ${Math.round((travel.cost / timespan) * 100) / 100}`,
          options: { align: "center" },
        },
      ]);
    });

  // Accommodation rows
  locations
    .filter((loc) => loc.accommodation)
    .forEach((loc) => {
      const locMonths = Math.floor(
        dayjs(loc.start_date).diff(dayjs(), "months", true),
      );
      if (loc.accommodation) {
        const cost = loc.nights * loc.accommodation.price;

        tableRows.push([
          { text: loc.accommodation.name },
          { text: "Accommodation" },
          {
            text: `${currency} ${Math.round(cost * rate * 100) / 100}`,
            options: { align: "center" },
          },
          { text: String(locMonths), options: { align: "center" } },
          {
            text: `${currency} ${Math.round(((cost * rate) / locMonths) * 100) / 100}`,
            options: { align: "center" },
          },
        ]);
      }
    });

  // Itinerary rows
  locations.forEach((loc) => {
    const activities = itinerary.filter((it) => it.locationId === loc.id);

    if (!activities.length) return;

    const total = sum(activities.map(({ cost }) => Number(cost)));

    tableRows.push([
      {
        text: `${loc.city} (${dayjs(loc.start_date).format(
          "DD MMM",
        )} - ${dayjs(loc.end_date).format("DD MMM")})`,
      },
      { text: "Itinerary" },
      {
        text: `${currency} ${total}`,
        options: { align: "center" },
      },
      { text: String(months), options: { align: "center" } },
      {
        text: `${currency} ${Math.round((total / months) * 100) / 100}`,
        options: { align: "center" },
      },
    ]);
  });

  // Table
  slide.addTable(tableRows, {
    x: 0.3,
    y: 1,
    w: 9.4,
    colW: [3.2, 1.6, 1.4, 1.6, 1.6],
    border: { type: "solid", color: "666666" },
    fill: { color: "F9F9F9" },
    fontSize: 12,
  });
};

export const exportTripPPT = async (
  tripId: string,
  values: {
    summary: boolean;
    location: boolean;
    accommodation: boolean;
    budget: boolean;
  },
) => {
  const pptx = new PptxGenJS();

  const { trips, locations, budgets } = useDBStore.getState();

  const trip = trips.find(({ id }) => id === tripId) ?? null;
  const tripLocations = locations.filter((loc) => loc.tripId === tripId);
  const tripBudget = budgets.find((budget) => budget.tripId === tripId);

  if (!trip) return;

  const titleSlide = pptx.addSlide();
  titleSlide.addText(trip.name, {
    x: 1,
    y: 1.5,
    fontSize: 32,
    bold: true,
  });

  titleSlide.addText(
    `${dayjs(trip.start_date).format("dddd, DD MMMM YYYY")} → ${dayjs(trip.end_date).format("dddd, DD MMMM YYYY")}`,
    {
      x: 1,
      y: 2.5,
      fontSize: 16,
    },
  );

  buildSummarySlide(pptx, trip, tripLocations);

  if (values.location) {
    for (const location of tripLocations) {
      buildLocationSlide(pptx, location);
    }
  }
  if (values.budget && tripBudget) {
    buildBudgetSlide(pptx, tripBudget, trip, locations);
  }

  pptx.writeFile({ fileName: `${trip.name}.pptx` });
};
