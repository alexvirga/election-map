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
  Dialog,
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { getProfile } from "../api/api";
import { useNavigate } from "react-router-dom";
import MyLeagues from "../Components/MyLeagues";
import NewLeague from "../Components/CreateLeague/NewLeague";
import JoinLeague from "../Components/CreateLeague/JoinLeague";
import { useSession } from "../context/SessionContext";
import NewLeagueDialog from "./NewLeagueDialog";

import { supabase } from "../api/supabase";

interface DrawerItem {
  text: string;
  link: string;
}

const ResponsiveAppBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { session } = useSession();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const user = session?.user;

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const handleNavigation = (link: string) => {
    navigate(link);
    setDrawerOpen(false);
  };

  const drawerItems: DrawerItem[] = [
    { text: "Home", link: "/" },
    { text: "About", link: "/about" },
    { text: "Services", link: "/services" },
    { text: "Contact", link: "/contact" },
  ];

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderBottom: " 4px solid #1976d2",
          color: "inherit",
          backgroundColor: "#f1f1f1",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: isMobile ? "flex-start" : "center",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              cursor: "pointer",
              textAlign: isMobile ? "center" : "left",
            }}
            onClick={() => navigate(`/`)}
          >
            VotePot
          </Typography>

          {!isMobile && (
            <Box
              sx={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
            >
              {/* <Button color="inherit" onClick={() => navigate(`/`)}>
                Home
              </Button> */}
              <JoinLeague />
              <Button color="inherit" onClick={handleDialogOpen}>
                New League
              </Button>
              <Button color="inherit" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            {username}
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <MyLeagues />
          <Divider sx={{ marginY: 2 }} />
          <JoinLeague />
          <Divider sx={{ marginY: 2 }} />
          <NewLeague />
          <Divider sx={{ marginY: 2 }} />
          <List>
            {drawerItems.map((item, index) => (
              <ListItem key={index} onClick={() => handleNavigation(item.link)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* To prevent content from being hidden under the fixed AppBar */}
      <Toolbar />
      <NewLeagueDialog open={dialogOpen} handleClose={handleDialogClose} />
    </>
  );
};

export default ResponsiveAppBar;
