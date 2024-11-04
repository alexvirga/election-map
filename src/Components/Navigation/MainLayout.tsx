import SideDrawer from "./SideDrawer";
import { useMediaQuery, useTheme } from "@mui/material";

const MainLayout = ({ children }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div style={{ display: "flex" }}>
      <SideDrawer />
      <main
        style={{
          flexGrow: 1,
          padding: "24px",
          marginLeft: isMobile ? 0 : 250,
          marginTop: "60px",
          transition: "margin 0.3s ease-in-out",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
