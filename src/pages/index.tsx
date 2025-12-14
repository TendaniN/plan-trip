import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import HomePage from "./home";
import { useEffect, useState } from "react";
import { initDB } from "stores/db";
import RegisterPage from "./register";
import LoginPage from "./login";
import { PageSpinner, Navbar } from "components";
import { useAccountStore } from "stores/account";

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const account = useAccountStore((state) => state);

  const [siteLoading, setSiteLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initDB();
      setSiteLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!siteLoading) {
      if (
        account.username === "" &&
        account.id === 0 &&
        location.pathname !== "/register" &&
        location.pathname !== "/login"
      ) {
        navigate("/register");
      }
    }
  }, [siteLoading, account, navigate, location.pathname]);

  if (siteLoading) {
    return (
      <Container>
        <PageSpinner />
      </Container>
    );
  }

  return (
    <Container>
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
        <Route path="/account" element={<div>Account</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Container>
  );
};

export default Pages;
