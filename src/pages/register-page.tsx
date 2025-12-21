import { RegisterForm, PageContainer } from "components";
import { Typography } from "@mui/material";

const RegisterPage = () => {
  return (
    <PageContainer>
      <Typography
        align="center"
        variant="h2"
        sx={{ fontFamily: '"Chango", system-ui' }}
      >
        Create an account
      </Typography>
      <RegisterForm />
    </PageContainer>
  );
};

export default RegisterPage;
