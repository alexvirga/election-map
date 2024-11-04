import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";

type ProvidersProps = {
  children?: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return <SessionProvider>{children ? children : <Outlet />}</SessionProvider>;
};

export default Providers;
