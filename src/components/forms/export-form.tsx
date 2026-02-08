import { Checkbox, Flex, InputDescription } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Button } from "components/button";
import type { ExportValues } from "constants/export";

import { exportTripExcel } from "utils/export-trip-excel";
import { exportTripPDF } from "utils/export-trip-pdf";
import { exportTripPPT } from "utils/export-trip-ppt";

export const ExportForm = ({
  tripId,
  type = "excel",
}: {
  tripId: string;
  type: ExportValues;
}) => {
  const { values, getInputProps, onSubmit } = useForm({
    initialValues: {
      summary: true,
      location: false,
      accommodation: false,
      budget: false,
    },
    onSubmitPreventDefault: "always",
  });

  const handleSubmit = (vals: typeof values) => {
    if (type === "excel") {
      exportTripExcel(tripId, vals);
    } else if (type === "pdf") {
      exportTripPDF(tripId, vals);
    } else if (type === "pptx") {
      exportTripPPT(tripId, vals);
    }
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Flex direction="column" gap={18}>
        <Flex direction="column">
          <Checkbox
            color="blue.5"
            iconColor="#000"
            required
            value={values.summary}
            checked={values.summary}
            label="Summary"
            {...getInputProps("summary")}
          />
          <InputDescription mt={4} c="primary.9">
            Overview of locations, travel dates, and nights stayed.
          </InputDescription>
        </Flex>
        <Flex direction="column">
          <Checkbox
            color="secondary.5"
            iconColor="#000"
            value={values.location}
            checked={values.location}
            label="Location"
            {...getInputProps("location")}
          />
          <InputDescription mt={4} c="primary.9">
            Daily itinerary with activities, timing, costs, and links for each
            location in the trip.
          </InputDescription>
        </Flex>
        <Flex direction="column">
          <Checkbox
            color="secondary.5"
            iconColor="#000"
            // Note: Excel is still planning stage so accommodations are visible. PDF and PPTX are treated as final exports
            disabled={type !== "excel"}
            value={values.accommodation}
            checked={values.accommodation}
            label="Accommodation"
            {...getInputProps("accommodation")}
          />
          <InputDescription mt={4} c="primary.9">
            Hotel details, ratings, pricing, star level, and included meals for
            each location in the trip.
          </InputDescription>
        </Flex>
        <Flex direction="column">
          <Checkbox
            color="secondary.5"
            iconColor="#000"
            value={values.budget}
            checked={values.budget}
            label="Budget"
            {...getInputProps("budget")}
          />
          <InputDescription mt={4} c="primary.9">
            Includes total costs for accommodation and itinerary, any additional
            expenses, and a monthly budgeting plan from next month until your
            trip departure.
          </InputDescription>
        </Flex>
        <Button type="submit" color="secondary.2" w="100%">
          Export
        </Button>
      </Flex>
    </form>
  );
};
