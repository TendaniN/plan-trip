import { Button } from "@mui/material";
import { Navbar } from "components/navbar";
import { Routes, Route } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Pages = () => {
  return (
    <Container>
      <Navbar />
      <Routes>
        <Route path="*" element={<Button>Hello</Button>} />
      </Routes>
    </Container>
  );
};

export default Pages;
