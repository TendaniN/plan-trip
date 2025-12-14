import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { CITIES_MAP } from "constants/cities";
import { Link } from "react-router-dom";

export const CityListContainer = () => (
  <ImageList cols={3} rowHeight={245} sx={{ height: 450 }}>
    {CITIES_MAP.map(({ id, label, image, country }) => (
      <Link key={`city-${id}`} to={`/city/${id}`}>
        <ImageListItem sx={{ maxHeight: 245 }}>
          <img
            srcSet={`src/${image}`}
            src={`src/${image}`}
            alt={`${label} Image`}
            loading="lazy"
            style={{ maxHeight: 245 }}
          />
          <ImageListItemBar title={label} subtitle={country} />
        </ImageListItem>
      </Link>
    ))}
  </ImageList>
);
