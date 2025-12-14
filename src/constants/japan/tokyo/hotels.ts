import type { HotelProps } from "types/hotels";

interface TokyoHotelProps extends HotelProps {
  area:
    | "Ota City"
    | "Toshima City"
    | "Chuo City"
    | "Minato City"
    | "Koto City"
    | "Shinagawa City";
}

export const hotels: TokyoHotelProps[] = [
  {
    id: "mecure-tokyo-haneda-airport",
    name: "Mercure Tokyo Haneda Airport",
    area: "Ota City",
    rating: { booking: 9.1, google: 4.8 },
    stars: 4,
    price: 2760,
    link: "https://www.booking.com/hotel/jp/mercure-tokyo-haneda-airport.en-gb.html",
    room: {
      title: "Superior Room - Non Smoking",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    id: "hotel-metropolitan-haneda",
    name: "Hotel Metropolitan Haneda",
    area: "Ota City",
    rating: { booking: 9.1, google: 4.5 },
    stars: 4,
    price: 2305,
    link: "https://www.booking.com/hotel/jp/metropolitan-tokyo-haneda.en-gb.html",
    room: {
      title: "Standard Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    id: "hotel-metropolitan-tokyo-ikebukuro",
    name: "Hotel Metropolitan Tokyo Ikebukuro",
    area: "Toshima City",
    rating: { booking: 8.7, google: 4.2 },
    stars: 4,
    price: 4410,
    link: "https://www.booking.com/hotel/jp/metropolitan-tokyo.en-gb.html",
    room: {
      title: "Standard Queen Room - Non-Smoking",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    id: "remm-plus-ginza",
    name: "remm plus Ginza",
    area: "Chuo City",
    rating: { booking: 8.5, google: 4.3 },
    stars: 4,
    price: 2725,
    link: "https://www.booking.com/hotel/jp/remm-plus-ginza.en-gb.html",
    room: {
      title: "Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    id: "miyako-city-tokyo-takanawa",
    name: "Miyako City Tokyo Takanawa",
    area: "Minato City",
    rating: { booking: 8.7, google: 4.3 },
    stars: 4,
    price: 3570,
    link: "https://www.booking.com/hotel/jp/jia-cheng-hoterujin-tie-dong-jing-dong-jing-gao-lun.en-gb.html",
    room: {
      title: "Moderate King Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    id: "villa-fontaine-grand-tokyo-ariake",
    name: "Villa Fontaine Grand Tokyo Ariake",
    area: "Koto City",
    rating: { booking: 8.4, google: 4.1 },
    stars: 4,
    price: 6010,
    link: "https://www.booking.com/hotel/jp/villa-fontaine-grand-tokyo-ariake.en-gb.html",
    room: {
      title: "Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    id: "loisir-hotel-shinagawa-seaside",
    name: "Loisir Hotel Shinagawa Seaside",
    area: "Shinagawa City",
    rating: { booking: 8.4, google: 3.9 },
    stars: 3,
    price: 3210,
    link: "https://www.booking.com/hotel/jp/loisir-shinagawa-seaside.en-gb.html",
    room: {
      title: "Queen Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
];
