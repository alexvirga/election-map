import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import SidePanel from "./Components/SidePanel";
import Drawer from "@mui/material/Drawer";
import AppDrawer from "./Components/AppDrawer";

const Providers = () => {
  return (
    <SessionProvider>
      {/* <AppDrawer /> */}
      <Outlet />
    </SessionProvider>
  );
};

export default Providers;
