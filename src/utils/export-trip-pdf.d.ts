declare module "utils/export-trip-pdf" {
  export function exportTripPDF(
    tripId: string,
    values: {
      summary: boolean;
      location: boolean;
      accommodation: boolean;
      budget: boolean;
    },
  ): void;
}
