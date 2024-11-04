import { createBrowserRouter } from "react-router-dom";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../Providers.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthPage from "../pages/auth/AuthPage.tsx";
import LeagueDetails from "../Components/LeagueDetails.tsx";
import App from "../App.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      {
        path: "/",
        element: <AuthPage />,
      },

      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/home",
            element: <App />,
          },

          {
            path: "/league/:id",
            element: <LeagueDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
