import { LoginForm } from "components";
import { Container, Title } from "@mantine/core";

const LoginPage = () => {
  return (
    <Container p={24} h="calc(100vh - 60px)">
      <Title mt="36" order={2} style={{ textAlign: "center" }}>
        Welcome Back!
      </Title>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
