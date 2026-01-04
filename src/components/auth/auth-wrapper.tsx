import { showNotification } from "@mantine/notifications";
import { useDBStore } from "db/store";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSession, isSessionExpired } from "utils/session";

interface Props {
  renderDenied: ReactNode;
  children: ReactNode;
}

export const AuthWrapper = ({ renderDenied, children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, username } = useDBStore((state) => state);

  if (isSessionExpired()) {
    clearSession();

    if (location.pathname !== "/login") {
      showNotification({
        title: "Session ended",
        message: "Redirecting to login...",
      });

      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
    }

    return null;
  }

  if (id === "" || username === "") {
    return renderDenied;
  }

  return children;
};
