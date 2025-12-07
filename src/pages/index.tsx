import { Navbar } from "components/navbar";
import { Routes, Route } from "react-router-dom";
import styled from "@emotion/styled";
import HomePage from "./home";
import { useEffect } from "react";
import { initDB } from "stores/db";

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Pages = () => {
  useEffect(() => {
    (async () => {
      await initDB();
    })();
  }, []);

  return (
    <Container>
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/trip" element={<div>Trip</div>}>
          <Route path="/:trip_id" element={<div>Trip</div>}>
            <Route path="/:location_id" element={<div>Location</div>} />
          </Route>
        </Route>
        <Route path="/account" element={<div>Account</div>} />
      </Routes>
    </Container>
  );
};

export default Pages;
