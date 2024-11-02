import React, { useState } from "react";
import USMap from "../Components/Map/USMap";
import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
} from "../usStatesPathData";
import { calculateTotals } from "../utils";
import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";

export const Homepage = () => {
  const [selectedStates, setSelectedStates] = useState<{
    [key: string]: { electoral_allocation: number; party: number };
  }>(electoralVotes);

  const { democratVotes, republicanVotes } = calculateTotals(selectedStates);

  return (
    <div style={{ maxWidth: "980px", width: "80%" }}>
      <ElectoralBar
        democratVotes={democratVotes}
        republicanVotes={republicanVotes}
      />
      <USMap
        setSelectedStates={setSelectedStates}
        selectedStates={selectedStates}
      />
    </div>
  );
};

export default Homepage;
