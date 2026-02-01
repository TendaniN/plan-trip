export const EXPORTS = {
  EXCEL: "excel",
  PDF: "pdf",
} as const;

export type ExportKeys = keyof typeof EXPORTS;
export type ExportValues = (typeof EXPORTS)[ExportKeys];
