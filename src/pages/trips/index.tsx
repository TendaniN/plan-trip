import { PageContainer } from "components/index";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { useAccountStore } from "stores/account";
import styled from "@emotion/styled";
import { formatDate } from "utils/format-date";
import moment from "moment";
import { sumDays } from "utils/sum-days";
import { Link } from "react-router-dom";
import { EditableText } from "components";
import { FaAngleRight } from "react-icons/fa6";
import { db } from "stores/db";
import logger from "utils/logger";
import { EditTripModal } from "components/modals/edit-trip-modal";
import { AddLocationModal } from "components/modals/add-location-modal";

const ListContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
`;

const TripContainer = styled.li`
  border-radius: 1.5rem;
  border: 0.25rem solid #000;
  background-color: var(--color-tertiary-200);
  padding: 1rem;
  display: flex;
  flex-direction: column;

  .trip-name {
    display: flex;
    justify-content: center;
    text-transform: capitalize;
    margin-bottom: 1rem;

    .MuiTypography-body1 {
      font-size: 1.5rem;
      font-weight: 800;

      svg {
        width: 1rem;
        fill: var(--mui-palette-grey-600);
      }
    }
  }

  .trip-actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
    gap: 0.5rem;

    button {
      margin: auto 0;
    }
  }

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

const TripsPage = () => {
  const { username, trips, updateTrip, id } = useAccountStore((state) => state);

  const handleDBUpdate = async (tripId: string, name: string) => {
    try {
      await db.user.update(id, (user) => {
        const trip = user.trips.find((t) => t.id === tripId);
        if (trip) {
          trip.name = name;
        }
      });
      updateTrip(tripId, { name });
      logger.info("Trip name was updated.");
    } catch (error) {
      logger.error("Trip name was not updated:", error);
    }
  };

  const handleTripNameChange = (tripId: string, name: string) => {
    handleDBUpdate(tripId, name);
  };

  return (
    <PageContainer>
      <Typography
        variant="h2"
        sx={{ fontFamily: '"Chango", system-ui', textTransform: "capitalize" }}
      >
        {`${username}'s Trips`}
      </Typography>
      <ListContainer>
        {trips.map(({ id, name, locations }) => (
          <TripContainer key={`trip-${id}`}>
            <div className="trip-actions">
              <EditTripModal />
              <AddLocationModal tripId={id} />
            </div>
            <div className="trip-name">
              <EditableText
                id={id}
                initialText={name}
                onSave={handleTripNameChange}
              />
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Arrive</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Depart</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Nights</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={`trip-${id}-location-${location.id}`}>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {location.city}
                      </TableCell>
                      <TableCell>
                        {formatDate(moment(location.start_date, "YYYY-MM-DD"))}
                      </TableCell>
                      <TableCell>
                        {formatDate(moment(location.end_date, "YYYY-MM-DD"))}
                      </TableCell>
                      <TableCell>{location.num_of_nights}</TableCell>
                      <TableCell>
                        <Link
                          to={`/trip/${id}/${location.id}`}
                          style={{ display: "flex", gap: "0.25rem" }}
                        >
                          See more <FaAngleRight style={{ margin: "auto 0" }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={3} colSpan={2} />
                    <TableCell sx={{ fontWeight: 500 }}>Total days</TableCell>
                    <TableCell>
                      {sumDays(
                        locations.map(({ num_of_nights }) => num_of_nights)
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </TripContainer>
        ))}
      </ListContainer>
    </PageContainer>
  );
};

export default TripsPage;
