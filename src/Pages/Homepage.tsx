import { useState, useEffect } from "react";
import USMap from "../Components/Map/USMap";
import { electoralVotes } from "../usStatesPathData";

import { calculateTotals } from "../utils";
import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";
import { predictionApi } from "../api/api";

import { useSession } from "../context/SessionContext";

export const Homepage = () => {
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: { electoral_allocation: number; party: number };
  }>(electoralVotes);
  const [, setLoading] = useState(true);
  const { democratVotes, republicanVotes } = calculateTotals(selectedStates);
  const { session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        if (user) {
          const predictions = await predictionApi.getUserPredictions(user.id);

          if (predictions && predictions.length > 0) {
            setSelectedStates(predictions[0].predictions);
          }
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const handleCreatePrediction = async () => {
    try {
      if (user) {
        await predictionApi.createPrediction(user.id, selectedStates);
        alert("Prediction created successfully!");
      }
    } catch (error) {
      console.error("Error creating prediction:", error);
    }
  };

  return (
    <div style={{ maxWidth: "980px", width: "100%", padding: "10px" }}>
      <ElectoralBar
        democratVotes={democratVotes}
        republicanVotes={republicanVotes}
      />
      <USMap
        setSelectedStates={setSelectedStates}
        selectedStates={selectedStates}
      />
      <button
        onClick={handleCreatePrediction}
        style={{ marginTop: "20px" }}
      ></button>
    </div>
  );
};

export default Homepage;
