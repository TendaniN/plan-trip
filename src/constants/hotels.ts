import { hotels as osaka } from "./japan/osaka/hotels";
import { hotels as tokyo } from "./japan/tokyo/hotels";
import { hotels as seoul } from "./south korea/seoul/hotels";

export const ALL_HOTELS = [
  { type: "osaka", hotels: osaka },
  { type: "tokyo", hotels: tokyo },
  { type: "seoul", hotels: seoul },
];
