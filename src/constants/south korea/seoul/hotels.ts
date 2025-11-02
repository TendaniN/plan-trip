import type { HotelProps } from "types/hotels";

interface SeoulHotelProps extends HotelProps {
  area:
    | "Hongdae"
    | "Myeongdong"
    | "Jung-Gu"
    | "Mapo-Gu"
    | "Gangnam-Gu"
    | "Jongno-Gu"
    | "Gangseo-Gu";
}

export const hotels: SeoulHotelProps[] = [
  {
    name: "Mercure Ambassador Seoul Hongdae",
    area: "Hongdae",
    rating: { booking: 8.9, naver: 4.9, google: 4.6 },
    stars: 4,
    distance: {
      centre: 5200,
      metro: 450,
    },
    price: 4055,
    link: "https://www.booking.com/hotel/kr/mercure-ambassador-seoul-hongdae.html",
    room: {
      title: "Standard King Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Queen",
      },
    },
    breakfast: true,
  },
  {
    name: "Four Points by Sheraton Josun, Seoul",
    area: "Myeongdong",
    rating: { booking: 8.6, naver: 4.6, google: 4.3 },
    stars: 4,
    distance: {
      centre: 700,
      metro: 550,
    },
    price: 3901,
    link: "https://www.booking.com/hotel/kr/four-points-by-sheraton-seoul-myeongdong.html",
    room: {
      title: "Superior Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    name: "Fraser Place Central Seoul",
    area: "Jung-Gu",
    rating: { booking: 8.8, naver: 4.4, google: 4.2 },
    stars: 4,
    price: 2290,
    link: "https://www.booking.com/hotel/kr/fraser-place-central-seoul.html",
    room: {
      title: "Double Studio",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: false,
  },
  {
    name: "Nine Tree by Parnas Seoul Myeongdong 2",
    area: "Myeongdong",
    rating: { booking: 8.6, naver: 4.38, google: 4.3 },
    stars: 4,
    price: 8665,
    link: "https://www.booking.com/hotel/kr/nine-tree-premier-myeongdong.html",
    room: {
      title: "Hollywood Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    name: "Lotte City Hotel Myeongdong",
    area: "Myeongdong",
    rating: { booking: 8.5, naver: 4.48, google: 4.2 },
    stars: 4,
    price: 4125,
    link: "https://www.booking.com/hotel/kr/lotte-city-seoul-myeongdong.html",
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
    name: "Sotetsu Hotels The Splaisir Seoul Myeongdong",
    area: "Myeongdong",
    rating: { booking: 8.3, naver: 4.2, google: 4 },
    stars: 4,
    price: 1985,
    distance: {
      centre: 200,
      metro: 550,
    },
    link: "https://www.booking.com/hotel/kr/lotte-city-seoul-myeongdong.html",
    room: {
      title: "Standard Latex Double Room",
      sharing: false,
      bed: {
        total: 1,
        type: "Double",
      },
    },
    breakfast: true,
  },
  {
    name: "Orakai Daehakro Hotel, BW Signature Collection",
    area: "Jongno-Gu",
    rating: { booking: 8.7, naver: 4.3, google: 4.5 },
    stars: 4,
    price: 3324,
    distance: {
      centre: 2200,
      metro: 850,
    },
    link: "https://www.booking.com/hotel/kr/orakai-daehakro.en-gb.html",
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
    name: "Amanti Hotel Seoul Hongdae",
    area: "Mapo-Gu",
    rating: { booking: 8.6, naver: 4.45, google: 4.5 },
    stars: 4,
    price: 3426,
    distance: {
      centre: 5500,
      metro: 850,
    },
    link: "https://www.booking.com/hotel/kr/amanti-seoul.en-gb.html",
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
];
