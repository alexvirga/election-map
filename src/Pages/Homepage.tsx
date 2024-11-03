import React, { useState, useEffect } from "react";
import USMap from "../Components/Map/USMap";
import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
} from "../usStatesPathData";
import { Session } from "@supabase/supabase-js";
import { calculateTotals } from "../utils";
import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";
import { predictionApi } from "../api/api";
import { supabase } from "../api/supabase";
import { useSession } from "../context/SessionContext";

export const Homepage = () => {
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: { electoral_allocation: number; party: number };
  }>(electoralVotes);
  const [loading, setLoading] = useState(true);
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
        const newPrediction = await predictionApi.createPrediction(
          user.id,
          selectedStates
        );
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
