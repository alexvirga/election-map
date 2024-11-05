import { electoralVotes } from "../usStatesPathData";

import { useState } from "react";

import { Typography, Box, Divider } from "@mui/material";
import AuthPage from "./auth/AuthPage";
import USMap from "../Components/Map/USMap";
import { calculateTotals } from "../utils";

import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";

const Landing = () => {
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: { electoral_allocation: number; party: number };
  }>(electoralVotes);
  const { democratVotes, republicanVotes } = calculateTotals(selectedStates);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 500,
          display: "flex",
          width: "100%",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: '"Lora", serif',
        }}
      >
        POLLLEAGUE
      </Typography>
      <Typography
        variant="body2"
        sx={{
          display: "flex",
          maxWidth: "600px",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Predict electoral outcomes on an interactive US map and join leagues to
        compete with friends. Lock in your picks by 6 PM EST Tuesday Nov. 5th,
        then explore and compare predictions with other league members.
      </Typography>
      <Divider sx={{ width: "60%", mt: "20px" }} />
      <AuthPage />
      <Divider sx={{ width: "60%" }} />
      <div
        style={{
          maxWidth: "920px",
          margin: "auto",
          display: "flex",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <ElectoralBar
          democratVotes={democratVotes}
          republicanVotes={republicanVotes}
        />
        <div style={{ maxWidth: "920px" }}>
          <USMap
            setSelectedStates={setSelectedStates}
            selectedStates={selectedStates}
          />
        </div>
      </div>
    </Box>
  );
};

export default Landing;
