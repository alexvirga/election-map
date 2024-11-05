import { Routes, Route } from "react-router-dom";
import AuthProtectedRoute from "./router/AuthProtectedRoute.tsx";
import Providers from "./Providers.tsx";
import NotFoundPage from "./pages/404Page.tsx";

import Dashboard from "./pages/Dashboard";
import LeagueDetails from "./Components/LeagueDetails.tsx";
import MainLayout from "./Components/Navigation/MainLayout.tsx";
import Landing from "./pages/Landing.tsx";
import CheckProfile from "./router/CheckProfile.tsx";
import Rules from "./pages/Rules.tsx";
function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="rules" element={<Rules />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<AuthProtectedRoute />}>
          <Route
            path="/home"
            element={
              <CheckProfile>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </CheckProfile>
            }
          />
          <Route
            path="/league/:invite_code"
            element={
              <CheckProfile>
                <MainLayout>
                  <LeagueDetails />
                </MainLayout>
              </CheckProfile>
            }
          />
        </Route>
      </Routes>
    </Providers>
  );
}

export default App;
