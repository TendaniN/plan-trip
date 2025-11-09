import styled from "@emotion/styled";
import { Typography, Autocomplete, TextField, Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { CITIES_MAP } from "constants/cities";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { PageContainer } from "components/page-container";
import { PageLoader } from "components/page-loader";
import { useNavigate } from "react-router-dom";

import "dayjs/locale/en-gb";
import { db } from "stores/db";
import logger from "utils/logger";

const SearchContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  border-radius: 1.5rem;
  border: 0.25rem solid #000;
  background-color: var(--color-tertiary-500);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  fieldset {
    border-radius: 1rem;
  }

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

const DateContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 40rem) {
    flex-direction: column;

    .datepicker {
      width: 100%;
    }
  }
`;

const Spinner = styled(FaSpinner)`
  animation: spin 1.5s linear infinite;
  margin: auto 0;
  width: 1rem;
  height: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg); /* Start at 0 degrees rotation */
    }
    100% {
      transform: rotate(360deg); /* Rotate 360 degrees */
    }
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const [cityValue, setCityValue] = useState<{
    id: string;
    label: string;
    country: string;
  } | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const formDisabled = !cityValue || !startDate || !endDate || searching;

  const handleDBUpdate = async (country: string, label: string) => {
    try {
      const startId = await db.startDate.put({ id: 1, date: startDate });
      const endId = await db.endDate.put({ id: 1, date: endDate });
      const cityId = await db.cities.add({ country, label });

      logger.info(`Start Date (${startId}) updated.`);
      logger.info(`End Date (${endId}) updated.`);
      logger.info(`City (${cityId}) added to list.`);
      setSearching(false);
    } catch (error) {
      logger.error("Failed to update:" + error);
      setSearching(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearching(true);

    if (cityValue && startDate && endDate) {
      handleDBUpdate(cityValue.country, cityValue.label);
    } else {
      logger.error("Missing Inputs.");
      setSearching(false);
    }
  };

  useEffect(() => {
    (async () => {
      const dbStart = await db.startDate.get(1);
      const dbEnd = await db.endDate.get(1);
      const dbCities = await db.cities.toArray();

      if (dbStart && dbEnd && dbCities.length > 0) {
        navigate("/trip");
      } else {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <PageContainer>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Typography
            align="center"
            variant="h2"
            sx={{ fontFamily: '"Chango", system-ui' }}
          >
            Where are you headed?
          </Typography>
          <form onSubmit={handleSubmit}>
            <SearchContainer>
              <Autocomplete
                id="city"
                options={CITIES_MAP}
                groupBy={(option) => option.country}
                openOnFocus
                fullWidth
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "1rem",
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": { marginTop: "-8px" },
                  },
                }}
                value={cityValue}
                onChange={(_event, newValue) => setCityValue(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Select a city..." />
                )}
              />
              <DateContainer>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="en-gb"
                >
                  <DatePicker
                    name="start-date"
                    className="datepicker"
                    value={startDate}
                    minDate={dayjs()}
                    label="Start Date"
                    onChange={(value) => setStartDate(value)}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: "1rem",
                      width: "48%",
                      "& .MuiInputLabel-root": {
                        "&.Mui-focused": { marginTop: "-8px" },
                      },
                    }}
                  />
                  <div style={{ margin: "auto" }}>to</div>
                  <DatePicker
                    name="end-date"
                    className="datepicker"
                    value={endDate}
                    label="End Date"
                    minDate={startDate ? startDate : dayjs()}
                    onChange={(value) => setEndDate(value)}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: "1rem",
                      width: "48%",
                      "& .MuiInputLabel-root": {
                        "&.Mui-focused": { marginTop: "-8px" },
                      },
                    }}
                  />
                </LocalizationProvider>
              </DateContainer>
              <Button
                type="submit"
                variant="contained"
                disabled={formDisabled}
                aria-disabled={formDisabled}
                sx={{
                  display: "flex",
                  gap: "0.5rem",
                  bgcolor: "var(--color-accent-500)",
                  color: "#000",
                  borderRadius: "1rem",
                }}
              >
                {searching && <Spinner />}Submit
              </Button>
            </SearchContainer>
          </form>
        </>
      )}
    </PageContainer>
  );
};

export default HomePage;
