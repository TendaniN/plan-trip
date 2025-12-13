import styled from "@emotion/styled";
import { LuShipWheel } from "react-icons/lu";

export const PageSpinner = styled(LuShipWheel)`
  animation: spin 5s linear infinite;
  margin: auto;
  width: 10rem;
  height: 10rem;
  fill: var(--color-tertiary-600);
  stroke: var(--color-accent-500);

  @keyframes spin {
    0% {
      transform: rotate(0deg); /* Start at 0 degrees rotation */
    }
    100% {
      transform: rotate(360deg); /* Rotate 360 degrees */
    }
  }
`;
