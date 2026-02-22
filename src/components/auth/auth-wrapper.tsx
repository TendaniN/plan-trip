import { type ReactNode } from "react";
import { useAuthStore } from "db/store";

interface Props {
  renderDenied: ReactNode;
  children: ReactNode;
}

export const AuthWrapper = ({ children, renderDenied }: Props) => {
  const { uid } = useAuthStore((state) => state);

  if (uid === "") {
    return renderDenied;
  }

  return children;
};
