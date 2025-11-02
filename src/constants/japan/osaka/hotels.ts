import type { HotelProps } from "types/hotels";

interface OsakaHotelProps extends HotelProps {
  area: "Namba" | "Chuo Ward" | "Kita Ward" | "Naniwa Ward";
}

export const hotels: OsakaHotelProps[] = [
  {
    name: "Citadines Namba Osaka",
    area: "Namba",
    rating: { booking: 9.1, google: 4.6 },
    stars: 4,
    price: 3519,
    link: "https://www.booking.com/hotel/jp/citadines-namba-osaka.html",
    room: {
      title: "Studio Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Queen",
      },
    },
    breakfast: true,
  },
  {
    name: "Cross Hotel Osaka",
    area: "Chuo Ward",
    rating: { booking: 8.9, google: 4.4 },
    stars: 4,
    price: 4260,
    link: "https://www.booking.com/hotel/jp/cross-osaka.en-gb.html",
    room: {
      title: "Standard Floor Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    name: "Premier Hotel Cabin President Osaka",
    area: "Kita Ward",
    rating: { booking: 8.9, google: 4.4 },
    stars: 3,
    price: 2935,
    link: "https://www.booking.com/hotel/jp/premiumhotel-cabin-osaka.html",
    room: {
      title: "Double Room - Non-Smoking",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    name: "The Royal Park Hotel Iconic Osaka Midosuji",
    area: "Chuo Ward",
    rating: { booking: 8.9, google: 4.4 },
    stars: 4,
    price: 3050,
    link: "https://www.booking.com/hotel/jp/the-royal-park-hotel-iconic-osaka-midosuji.html",
    room: {
      title: "Comfort Double Room - Non-Smoking",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: false,
  },
  {
    name: "Osaka Excel Hotel Tokyu",
    area: "Chuo Ward",
    rating: { booking: 8.9, google: 4.4 },
    stars: 5,
    price: 3742,
    link: "https://www.booking.com/hotel/jp/osaka-excel-hotel-tokyu.html",
    room: {
      title: "Superior Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Queen",
      },
    },
    breakfast: true,
  },
  {
    name: "The Royal Park Canvas - Osaka Kitahama",
    area: "Chuo Ward",
    rating: { booking: 8.8, google: 4.4 },
    stars: 3,
    price: 2310,
    link: "https://www.booking.com/hotel/jp/za-roiyarupakukiyanbasu-da-ban-bei-bang.html",
    room: {
      title: "Comfort Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    name: "Fairfield by Marriott Osaka Namba",
    area: "Naniwa Ward",
    rating: { booking: 8.8, google: 4.2 },
    stars: 4,
    price: 3600,
    link: "https://www.booking.com/hotel/jp/fairfield-by-marriott-osaka-namba.html",
    room: {
      title: "King Room",
      sharing: false,
      bed: {
        total: 1,
        type: "King",
      },
    },
    breakfast: true,
  },
  {
    name: "Hotel Resol Trinity Osaka",
    area: "Kita Ward",
    rating: { booking: 8.7, google: 4.3 },
    stars: 4,
    price: 3150,
    link: "https://www.booking.com/hotel/jp/hotel-resol-trinity-osaka.html",
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
];
