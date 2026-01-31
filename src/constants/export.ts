export const EXPORTS = {
  EXCEL: "excel",
} as const;

export type ExportKeys = keyof typeof EXPORTS;
export type ExportValues = (typeof EXPORTS)[ExportKeys];
