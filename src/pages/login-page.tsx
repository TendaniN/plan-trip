import { LoginForm } from "components";
import { Container, Title } from "@mantine/core";

const LoginPage = () => {
  return (
    <Container p={24} h="calc(100vh - 60px)">
      <Title mt={36} mb={18} order={2} ta="center">
        Welcome Back!
      </Title>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
