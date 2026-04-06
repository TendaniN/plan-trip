import { useDBStore } from "db";
import pdfMake from "./pdf";
import dayjs from "dayjs";
import { sum } from "./sum";
import { workingSumDays } from "./sum-days";

const styles = {
  title: {
    fontSize: 28,
    bold: true,
    margin: [0, 0, 0, 12],
    alignment: "center",
  },
  tableHeader: {
    bold: true,
    background: "",
    fillColor: "#F0F0F0",
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 8],
  },
};

const buildSummaryPage = (trip, locations) => [
  { text: trip.name, style: "title" },
  {
    text: [
      { text: "Total number of nights: ", bold: true },
      String(sum(locations.map(({ nights }) => nights))),
    ],
    alignment: "center",
  },
  {
    text: [
      { text: "Total number of working days: ", bold: true },
      String(workingSumDays(trip.start_date, trip.end_date)),
    ],
    alignment: "center",
    margin: [0, 0, 0, 8],
  },
  ...locations.map((l) => [
    { text: l.country, style: "subheader" },
    {
      columns: [
        {
          ul: [
            [
              {
                text: [{ text: "City: ", bold: true }, { text: l.city }],
              },
            ],

            [
              {
                text: [
                  { text: "Nights: ", bold: true },
                  { text: String(l.nights) },
                ],
              },
            ],
          ],
        },
        {
          ul: [
            [
              {
                text: [
                  { text: "Arrive: ", bold: true },
                  { text: dayjs(l.start_date).format("dddd, DD MMMM YYYY") },
                ],
              },
            ],
            [
              {
                text: [
                  { text: "Depart: ", bold: true },
                  { text: dayjs(l.end_date).format("dddd, DD MMMM YYYY") },
                ],
              },
            ],
          ],
        },
      ],
    },
    {
      ul: [
        {
          text: [
            { text: "Hotel: ", bold: true },
            { text: l.accommodation ? l.accommodation.name : "not selected" },
          ],
        },
        {
          ul: l.accommodation
            ? [
                {
                  text: [
                    "Area: ",
                    {
                      text: l.accommodation.area
                        ? l.accommodation.area
                        : l.city,
                    },
                  ],
                },
                {
                  text: [
                    "Room: ",
                    {
                      text: `${l.accommodation.room.title} (${l.accommodation.room.bed.total} ${l.accommodation.room.bed.type} bed)`,
                    },
                  ],
                },
                {
                  text: [
                    "Link: ",
                    {
                      text: "booking.com",
                      link: l.accommodation.link,
                      color: "blue",
                      decoration: "underline",
                    },
                  ],
                },
              ]
            : [],
        },
      ],
      margin: [0, 0, 0, 16],
    },
  ]),
];

const buildLocationPage = (location) => {
  const { itinerary, currency } = useDBStore.getState();

  const itineraryMAP = itinerary
    .filter(({ locationId }) => locationId === location.id)
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .map((activity) => [
      dayjs(activity.date).format("dddd, DD MMMM YYYY"),
      { text: activity.time, alignment: "center" },
      activity.activity,
      { text: `${currency}${activity.cost}`, alignment: "center" },
      { text: String(activity.duration), alignment: "center" },
      {
        text: "link",
        link: activity.link,
        color: "blue",
        decoration: "underline",
        alignment: "center",
      },
    ]);

  return [
    {
      pageBreak: "before",
      pageOrientation: "landscape",
      text: location.city,
      style: "subheader",
    },
    {
      columns: [
        {
          text: [
            { text: "Arrive: ", bold: true },
            { text: location.start_date },
          ],
        },
        {
          text: [{ text: "Depart: ", bold: true }, String(location.end_date)],
        },
      ],
    },
    {
      columns: [
        { text: [{ text: "Nights: ", bold: true }, String(location.nights)] },
        {
          text: [
            { text: "Hotel: ", bold: true },
            { text: location.accommodation ? location.accommodation.name : "" },
          ],
          margin: [0, 0, 0, 16],
        },
      ],
    },
    {
      layout: {
        hLineWidth: function (i, node) {
          return i === 0 || i === node.table.body.length ? 2 : 1;
        },
        vLineWidth: function (i, node) {
          return i === 0 || i === node.table.widths.length ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return i === 0 || i === node.table.body.length ? "black" : "gray";
        },
        vLineColor: function (i, node) {
          return i === 0 || i === node.table.widths.length ? "black" : "gray";
        },
        paddingLeft: function () {
          return 4;
        },
        paddingRight: function () {
          return 4;
        },
      },
      table: {
        widths: [130, 60, 300, 85, 65, 70],
        body: [
          [
            { text: "Date", style: "tableHeader", alignment: "center" },
            { text: "Time", style: "tableHeader", alignment: "center" },
            { text: "Activity", style: "tableHeader", alignment: "center" },
            {
              text: `Cost (in ${currency})`,
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "Duration (in hrs)",
              style: "tableHeader",
              alignment: "center",
            },
            { text: "Link", style: "tableHeader", alignment: "center" },
          ],
          ...itineraryMAP,
        ],
      },
    },
  ];
};

const buildBudgetPage = (budget, trip, locations) => {
  const { travels, itinerary, rate, currency } = useDBStore.getState();

  const months = Math.floor(
    dayjs(trip.start_date).diff(dayjs(), "months", true),
  );

  const travelMAP = budget.travel.map((travelId) => {
    const travel = travels.filter(({ id }) => id === travelId)[0];
    const travelMonths = Math.floor(
      dayjs(trip.start_date).diff(dayjs(), "months", true),
    );
    const timespan = travelMonths <= 6 ? travelMonths : travelMonths - 6;

    return [
      `${travel.carrier} ${travel.type}`,
      "Travel",
      {
        text: `${currency} ${travel.cost}`,
        alignment: "center",
      },
      String(timespan),
      {
        text: `${currency} ${Math.round((travel.cost / timespan) * 100) / 100}`,
        alignment: "center",
      },
    ];
  });

  const locAccMAP = locations
    .filter((loc) => loc.accommodation)
    .map((loc) => {
      const locMonths = Math.floor(
        dayjs(loc.start_date).diff(dayjs(), "months", true),
      );
      if (loc.accommodation) {
        const cost = loc.nights * loc.accommodation.price;
        return [
          loc.accommodation.name,
          "Accommodation",
          {
            text: `${currency} ${Math.round(cost * rate * 100) / 100}`,
            alignment: "center",
          },
          String(locMonths),
          {
            text: `${currency} ${Math.round(((cost * rate) / locMonths) * 100) / 100}`,
            alignment: "center",
          },
        ];
      }
    });

  const locItineraryMAP = locations
    .map((loc) => {
      const activities =
        itinerary.filter((itinerary) => itinerary.locationId === loc.id);
      if (activities.length > 0) {
        return [
          `${loc.city} ${dayjs(loc.start_date).format(
            "(DD MMM - ",
          )}${dayjs(loc.end_date).format("DD MMM)")}`,
          "Itinerary",
          {
            text: `${currency} ${sum(activities.map(({ cost }) => Number(cost)))}`,
            alignment: "center",
          },
          String(months),
          {
            text: `${currency} ${
              Math.round(
                (sum(activities.map(({ cost }) => Number(cost))) / months) *
                  100,
              ) / 100
            }`,
            alignment: "center",
          },
        ];
      }
    });

  return [
    {
      pageBreak: "before",
      pageOrientation: "landscape",
      text: "Budget Plan",
      style: "subheader",
    },
    {
      table: {
        widths: [220, 110, "*", "*", "*"],
        body: [
          [
            { text: "Name", style: "tableHeader", alignment: "center" },
            { text: "Type", style: "tableHeader", alignment: "center" },
            {
              text: `Cost (in ${currency})`,
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "Timespan (now - departure)",
              style: "tableHeader",
              alignment: "center",
            },
            {
              text: "Monthly (cost / timespan)",
              style: "tableHeader",
              alignment: "center",
            },
          ],
          [
            "Buffer Total",
            "Buffer",
            {
              text: `${currency} ${budget.buffer}`,
              alignment: "center",
            },
            String(months),
            {
              text: `${currency} ${Math.round((budget.buffer / months) * 100) / 100}`,
              alignment: "center",
            },
          ],
          ...travelMAP,
          ...locAccMAP,
          ...locItineraryMAP,
        ],
      },
    },
  ];
};

export const exportTripPDF = (tripId, values) => {
  const { trips, locations, budgets } = useDBStore.getState();

  const trip = trips.find(({ id }) => id === tripId) ?? null;
  const tripLocations = locations.filter((loc) => loc.tripId === tripId);
  const tripBudget = budgets.find((budget) => budget.tripId === tripId);

  if (!trip) return;

  let content = [...buildSummaryPage(trip, tripLocations)];

  if (values.location || values.budget) {
    for (const location of tripLocations) {
      if (values.location) {
        const locationMap = buildLocationPage(location);
        content = [...content, ...locationMap];
      }
    }
    if (values.budget && tripBudget) {
      const budgetMap = buildBudgetPage(tripBudget, trip, tripLocations);
      content = [...content, ...budgetMap];
    }
  }

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    content,
    styles,
    footer: (currentPage, pageCount) => ({
      text: `${currentPage} / ${pageCount}`,
      alignment: "center",
      fontSize: 8,
    }),
  };

  pdfMake.createPdf(docDefinition).download(`${trip.name}.pdf`);
};
