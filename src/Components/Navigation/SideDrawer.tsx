import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
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
    <div>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: "4px solid #1976d2",
          backgroundColor: "#f1f1f1",
          zIndex: theme.zIndex.drawer + 1, // Ensure it stays above the drawer
          height: "60px",
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
          <Typography onClick={() => navigate(`/`)} variant="h6">
            Votepot
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ width: 220, padding: 2 }}>
          <Typography
            variant="h6"
            sx={{ marginBottom: 2 }}
            onClick={() => navigate(`/`)}
          >
            {username}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <MyLeagues />
          <Divider sx={{ marginY: 2 }} />
          <JoinLeague />
          <Divider sx={{ marginY: 2 }} />
          <Typography> Create New League </Typography>
          <NewLeague />
          <Divider sx={{ marginY: 2 }} />
        </Box>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
