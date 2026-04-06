import { ProtectedRoute } from "components";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
