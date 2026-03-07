import { useRoutes } from "react-router-dom";
import { tripRoutes } from "./trip.routes";
import { authRoutes } from "./auth.routes";
import { countryRoutes } from "./country.routes";
import HomePage from "features/home/index";
import AppLayout from "layouts/AppLayout";
import HelpPage from "features/help/help.page";

const AppRoutes = () => {
  return useRoutes([
    {
      path: "/",
      Component: AppLayout,
      children: [
        { index: true, Component: HomePage },
        ...tripRoutes,
        ...countryRoutes,
        {
          path: "/help",
          element: <HelpPage />,
        },
      ],
    },
    ...authRoutes,
  ]);
};

export default AppRoutes;
