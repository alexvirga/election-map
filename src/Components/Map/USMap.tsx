import React, { useState } from "react";
import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
} from "../../usStatesPathData";

interface USMapProps {
  setSelectedStates: (states: SelectedElectoralVotes) => void; // Updated to accept an argument
  selectedStates: SelectedElectoralVotes;
}

const colors = ["#d6d6d6", "#1375b7", "#c93135"];

const USMap = ({ setSelectedStates, selectedStates }: USMapProps) => {
  const handleStateClick = (abbreviation: string) => {
    const currentParty = selectedStates[abbreviation].party;
    const nextParty = (currentParty + 1) % colors.length;
    const allocation = selectedStates[abbreviation].electoral_allocation;

    const updatedStates = {
      ...selectedStates,
      [abbreviation]: {
        electoral_allocation: allocation,
        party: nextParty,
      },
    };

    setSelectedStates(updatedStates);
  };

  return (
    <div>
      <svg width="100%" height="100%" viewBox="50 0 1000 600">
        {usStatesPathData.map((state) => (
          <>
            <path
              key={state.name}
              d={state.path}
              fill={colors[selectedStates[state.name_short]?.party || 0]}
              stroke="white"
              strokeWidth="2.5"
              onClick={() => handleStateClick(state.name_short)}
              style={{ cursor: "pointer" }}
            />

            {state.displayLabel && (
              <>
                <text
                  x={state.labelX}
                  y={state.labelY}
                  fontSize="14"
                  fontWeight={600}
                  fill="black"
                  textAnchor="middle"
                  style={{ userSelect: "none" }}
                >
                  {state.name_short}
                </text>
                <text
                  x={state.labelX}
                  y={state.labelY + 17}
                  fontSize="12"
                  fill="black"
                  textAnchor="middle"
                  fontWeight={600}
                  style={{ userSelect: "none" }}
                >
                  {state.electoral_allocation}
                </text>
              </>
            )}
          </>
        ))}
      </svg>
    </div>
  );
};

export default USMap;
