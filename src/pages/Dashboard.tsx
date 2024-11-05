import { useState, useEffect } from "react";
import USMap from "../Components/Map/USMap";
import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";
import { electoralVotes } from "../usStatesPathData";
import { calculateTotals } from "../utils";
import { getProfile, updatePrediction } from "../api/api";
import { Button, Snackbar, Alert } from "@mui/material";
import { useSession } from "../context/SessionContext";

export const Dashboard = () => {
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: { electoral_allocation: number; party: number };
  }>(electoralVotes);
  const [, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { democratVotes, republicanVotes } = calculateTotals(selectedStates);
  const { session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const profile = await getProfile(user.id);

          if (profile.electoral_predictions) {
            setSelectedStates(profile.electoral_predictions);
          }
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCreatePrediction = async () => {
    try {
      if (user) {
        await updatePrediction(user.id, selectedStates);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
      }
    } catch (error) {
      console.error("Error creating prediction:", error);
    }
  };

  return (
    <div
      className="dashboard"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ maxWidth: "920px", width: "100%", padding: "10px" }}>
        {showSuccessMessage && (
          <Snackbar
            open={showSuccessMessage}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              variant="filled"
              sx={{
                color: "white",
                fontWeight: 400,
                backgroundColor: "#1c1c1c",
              }}
            >
              Selection saved!
            </Alert>
          </Snackbar>
        )}
        <div
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "10px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            borderBottom: "1px solid #ffeeba",
          }}
        >
          Your pick will remain hidden until 6 PM EST on Tuesday.
        </div>

        <ElectoralBar
          democratVotes={democratVotes}
          republicanVotes={republicanVotes}
        />
        <Button
          onClick={handleCreatePrediction}
          style={{
            marginTop: "20px",
            display: "flex",
            margin: "auto",
            backgroundColor: "white",
          }}
          color="inherit"
          variant="outlined"
        >
          Save
        </Button>
        <div style={{ maxWidth: "920px", margin: "auto" }}>
          <USMap
            setSelectedStates={setSelectedStates}
            selectedStates={selectedStates}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
