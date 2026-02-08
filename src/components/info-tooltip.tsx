import { Tooltip } from "@mantine/core";
import { FaInfoCircle } from "react-icons/fa";

export const InfoTooltip = ({ label }: { label: string }) => (
  <Tooltip label={label} withArrow my="auto">
    <FaInfoCircle size={14} style={{ color: "var(--mantine-color-blue-6)" }} />
  </Tooltip>
);
