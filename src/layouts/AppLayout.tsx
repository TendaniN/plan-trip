import { Navbar } from "components";
import useAuthListener from "hooks/useAuthListener";
import useExchangeRates from "hooks/useExchangeRates";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  useExchangeRates();
  useAuthListener();

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
