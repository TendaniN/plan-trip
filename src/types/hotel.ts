interface RatingProps {
  booking: number;
  google: number;
  naver?: number;
}

interface DistanceProps {
  // Can be centre or downtown
  centre: number;
  metro: number;
}

interface RoomProps {
  title: string;
  bed: {
    total: number;
    type: "Double" | "Twin" | "King" | "Queen";
  };
  sharing: boolean;
}

export interface HotelProps {
  id: string;
  name: string;
  area: string;
  rating: RatingProps;
  stars: number;
  distance?: DistanceProps;
  price: number;
  link: string;
  room: RoomProps;
  breakfast: boolean;
}
