interface LinkProps {
  primary: string;
  secondary?: string;
  extra?: string;
}

export interface ItineraryProps {
  id: number;
  name: string;
  location: string;
  day: number;
  start_time: string;
  end_time: string;
  duration: number;
  link: LinkProps;
}
