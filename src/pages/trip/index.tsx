import { PageContainer } from "components/index";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAccountStore } from "stores/account";
import styled from "@emotion/styled";

const ListContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
`;

const TripContainer = styled.li`
  margin: 0 auto;
  border-radius: 1.5rem;
  border: 0.25rem solid #000;
  background-color: var(--color-tertiary-200);
  padding: 1rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

const TABLE_HEADERS_MAP = [
  <TableCell>Location</TableCell>,
  <TableCell>Arrive</TableCell>,
  <TableCell>Depart</TableCell>,
  <TableCell>Nights</TableCell>,
  <TableCell></TableCell>,
];

const TripPage = () => {
  const { username, trips } = useAccountStore((state) => state);
  return (
    <PageContainer>
      <Typography
        variant="h2"
        sx={{ fontFamily: '"Chango", system-ui', textTransform: "capitalize" }}
      >
        {`${username}'s Trips`}
      </Typography>
      <div></div>
      <ListContainer>
        {trips.map(({ id, name, locations, start_date, end_date }) => (
          <TripContainer key={`trip-${id}`}>
            <div></div>
            <Table>
              <TableHead>
                <TableRow>{TABLE_HEADERS_MAP.map((header) => header)}</TableRow>
              </TableHead>
              <TableBody>
                {locations.map((location) => (
                  <TableRow>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.start_date}</TableCell>
                    <TableCell>{location.end_date}</TableCell>
                    <TableCell>{location.num_of_nights}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TripContainer>
        ))}
      </ListContainer>
    </PageContainer>
  );
};

export default TripPage;
