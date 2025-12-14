import { FaSpinner } from "react-icons/fa6";
import styled from "@emotion/styled";

export const ButtonSpinner = styled(FaSpinner)`
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
