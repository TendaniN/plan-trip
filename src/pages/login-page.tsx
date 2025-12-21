import { LoginForm, PageContainer } from "components";
import { Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <PageContainer>
      <Typography
        align="center"
        variant="h2"
        sx={{ fontFamily: '"Chango", system-ui' }}
      >
        Welcome Back
      </Typography>
      <LoginForm />
    </PageContainer>
  );
};

export default LoginPage;
