import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import SidePanel from "./Components/SidePanel";

const Providers = () => {
  return (
    <SessionProvider>
      <SidePanel />
      <Outlet />
    </SessionProvider>
  );
};

export default Providers;
