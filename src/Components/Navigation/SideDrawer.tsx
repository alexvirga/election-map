import { useState, useEffect } from "react";
import { supabase } from "../../api/supabase";
import Countdown from "../../Components/Countdown";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Box,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "../../context/SessionContext";
import { getProfile } from "../../api/api";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import JoinLeague from "../CreateLeague/JoinLeague";
import MyLeagues from "../MyLeagues";
import NewLeague from "../CreateLeague/NewLeague";
import MapIcon from "@mui/icons-material/Map";

const SideDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [username, setUsername] = useState<string>("");
  const { session } = useSession();
  const user = session?.user;
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const profile = await getProfile(user.id);
          if (profile.username) {
            setUsername(profile.username);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box>
      <AppBar
        className="app-bar"
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: "4px solid #1976d2",
          backgroundColor: "white",
          zIndex: theme.zIndex.drawer + 1, // Ensure it stays above the drawer
          color: "inherit",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            onClick={() => navigate(`/`)}
            variant="h6"
            sx={{ cursor: "pointer", fontFamily: '"Lora", serif' }}
          >
            POLLLEAGUE
          </Typography>
          <Countdown />
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        elevation={2}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            paddingTop: "65px",
            backgroundColor: "white",
            borderRight: "none",
          },
        }}
      >
        <Box
          className="drawer-contents"
          sx={{
            width: "100%",
            padding: 2,
            backgroundColor: "#1c1c1c",
            color: "#ffffff",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ marginBottom: 2, cursor: "pointer", color: "#ffffff" }}
            onClick={() => navigate(`/`)}
          >
            {username}
          </Typography>
          <Divider sx={{ marginBottom: 2, borderColor: "#494949" }} />

          <Button
            variant="text"
            sx={{ marginBottom: 2, cursor: "pointer", color: "#ffffff" }}
            onClick={() => navigate(`/`)}
            startIcon={<MapIcon />}
          >
            Make Selections
          </Button>

          <Divider sx={{ marginBottom: 2, borderColor: "#494949" }} />

          <MyLeagues />
          <Divider sx={{ marginY: 2, borderColor: "#494949" }} />
          <JoinLeague />
          <Divider sx={{ marginY: 2, borderColor: "#494949" }} />
          <Typography sx={{ color: "#ffffff" }}> Create New League </Typography>
          <NewLeague setIsDrawerOpen={setIsDrawerOpen} />
          <Divider sx={{ marginY: 2, borderColor: "#494949" }} />
        </Box>
        <Button
          color="inherit"
          onClick={() => supabase.auth.signOut()}
          sx={{ width: "100%" }}
        >
          Sign Out
        </Button>

        <Box
          sx={{
            display: "flex",
            marginTop: "auto",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              textAlign: "center",
              width: "100%",
              padding: 1,
              color: "#757575", // Light gray for subtlety
            }}
          >
            Created by{" "}
            <a
              href="https://alexvirga.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alex Virga
            </a>
            <br />
            <a
              href="https://www.buymeacoffee.com/alexvirga"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              Buy Me a Coffee
            </a>
          </Typography>
        </Box>
      </Drawer>{" "}
    </Box>
  );
};

export default SideDrawer;
