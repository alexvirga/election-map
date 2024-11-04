import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontFamily: '"Mukta", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#1976d2", // Custom primary color
    },
    secondary: {
      main: "#ff4081", // Custom secondary color
    },
    success: {
      main: "#4caf50", // Custom success color
    },
    error: {
      main: "#f44336", // Custom error color
    },
    warning: {
      main: "#ff9800", // Custom warning color
    },
    info: {
      main: "#2196f3", // Custom info color
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
