import React, { useState, useEffect } from "react";
import USMap from "../Components/Map/USMap";
import { electoralVotes } from "../usStatesPathData";

import { calculateTotals } from "../utils";
import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";
import { getProfile, updatePrediction } from "../api/api";
import { useSession } from "../context/SessionContext";

export const Dashboard = () => {
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: { electoral_allocation: number; party: number };
  }>(electoralVotes);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const { democratVotes, republicanVotes } = calculateTotals(selectedStates);
  const { session } = useSession();
  const user = session?.user;

  console.log(session);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const profile = await getProfile(user.id);

          if (profile.username) {
            setUsername(profile.username);
          }

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
        alert("Prediction created successfully!");
      }
    } catch (error) {
      console.error("Error creating prediction:", error);
    }
  };

  return (
    <div
      className="dashboard"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <div style={{ maxWidth: "980px", width: "100%", padding: "10px" }}>
        <ElectoralBar
          democratVotes={democratVotes}
          republicanVotes={republicanVotes}
        />
        <USMap
          setSelectedStates={setSelectedStates}
          selectedStates={selectedStates}
        />
        <button onClick={handleCreatePrediction} style={{ marginTop: "20px" }}>
          Save
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
