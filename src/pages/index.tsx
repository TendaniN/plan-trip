import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./home";
import { useEffect } from "react";

import RegisterPage from "./register";
import LoginPage from "./login";
import { Navbar } from "components";
import { useAccountStore } from "stores/account";

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const account = useAccountStore((state) => state);

  useEffect(() => {
    if (
      account.username === "" &&
      account.id === 0 &&
      location.pathname !== "/register" &&
      location.pathname !== "/login"
    ) {
      navigate("/login");
    }
  }, [account, navigate, location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/trip" element={<div>Trip</div>}>
          <Route path="/trip/:trip_id" element={<div>Trip</div>}>
            <Route
              path="/trip/:trip_id/:location_id"
              element={<div>Location</div>}
            />
          </Route>
        </Route>
        <Route path="/city/:city_id" element={<div>City</div>} />
        <Route path="/account" element={<div>Account</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default Pages;
