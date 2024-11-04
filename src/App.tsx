import { Routes, Route } from "react-router-dom";
import AuthProtectedRoute from "./router/AuthProtectedRoute.tsx";
import Providers from "./Providers.tsx";
import NotFoundPage from "./pages/404Page.tsx";

import Dashboard from "./pages/Dashboard";
import LeagueDetails from "./Components/LeagueDetails.tsx";
import MainLayout from "./Components/Navigation/MainLayout.tsx";
import Landing from "./pages/Landing.tsx";
function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route element={<AuthProtectedRoute />}>
          <Route
            path="/home"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/league/:id"
            element={
              <MainLayout>
                <LeagueDetails />
              </MainLayout>
            }
          />
          {/* Add other protected routes as needed */}
        </Route>
      </Routes>
    </Providers>
  );
}

export default App;
