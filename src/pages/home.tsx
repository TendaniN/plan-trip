import styled from "@emotion/styled";
import { Typography, Autocomplete, TextField, Button } from "@mui/material";
import moment, { type Moment } from "moment";
import { CITIES_MAP } from "constants/cities";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { PageContainer } from "components/page-container";
import { PageLoader } from "components/page-loader";
import { useNavigate } from "react-router-dom";

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
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const formDisabled = !cityValue || !startDate || !endDate || searching;

  const handleDBUpdate = async () => {
    try {
      // const cityId = await db.cities.add({
      //   country,
      //   label,
      //   startDate: startDate
      //     ? startDate.format("YYYY-MM-DD")
      //     : moment().format("YYYY-MM-DD"),
      //   endDate: endDate
      //     ? endDate.format("YYYY-MM-DD")
      //     : moment().add(1, "days").format("YYYY-MM-DD"),
      // });

      logger.info(`City added to list.`);
      setSearching(false);
      setLoading(false);
    } catch (error) {
      logger.error("Failed to update:" + error);
      setSearching(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearching(true);

    if (cityValue && startDate && endDate) {
      handleDBUpdate();
      navigate("/trip");
    } else {
      logger.error("Missing Inputs.");
      setSearching(false);
    }
  };

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
                <DatePicker
                  name="start-date"
                  className="datepicker"
                  value={startDate}
                  minDate={moment()}
                  label="Start Date"
                  onChange={(value) => setStartDate(value ? value : null)}
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
                  minDate={startDate ? startDate : moment()}
                  onChange={(value) => setEndDate(value ? value : null)}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "1rem",
                    width: "48%",
                    "& .MuiInputLabel-root": {
                      "&.Mui-focused": { marginTop: "-8px" },
                    },
                  }}
                />
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
