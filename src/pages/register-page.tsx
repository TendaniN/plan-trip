import { RegisterForm } from "components";
import { Container, Title } from "@mantine/core";

const RegisterPage = () => {
  return (
    <Container p={24} h="calc(100vh - 60px)">
      <Title mt="36" order={2} style={{ textAlign: "center" }}>
        Create an account
      </Title>
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
