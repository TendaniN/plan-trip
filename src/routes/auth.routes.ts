import LoginPage from "features/auth/login.page";
import RegisterPage from "features/auth/register.page";
import LogoutPage from "features/auth/logout.page";

export const authRoutes = [
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/logout",
    Component: LogoutPage,
  },
];
