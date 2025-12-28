import { useDBStore } from "db/store";
import type { ReactNode } from "react";

interface Props {
  renderDenied: ReactNode;
  children: ReactNode;
}

export const AuthWrapper = ({ renderDenied, children }: Props) => {
  const { id, username } = useDBStore((state) => state);

  if (id === "" || username === "") {
    return renderDenied;
  }

  return children;
};
