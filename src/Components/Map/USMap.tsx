import React, { useState } from "react";
import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
} from "../../usStatesPathData";
import "./Maps.css";

interface USMapProps {
  setSelectedStates: (states: SelectedElectoralVotes) => void; // Updated to accept an argument
  selectedStates: SelectedElectoralVotes;
  viewOnly?: boolean;
  smallView?: boolean;
}
type StateAbbreviation = keyof typeof electoralVotes;

const colors = ["#d6d6d6", "#1375b7", "#c93135"];
const smallStates: StateAbbreviation[] = [
  "MA",
  "RI",
  "CT",
  "NJ",
  "DE",
  "MD",
  "DC",
];

const USMap = ({
  setSelectedStates,
  selectedStates,
  viewOnly,
  smallView,
}: USMapProps) => {
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
    <div style={{ position: "relative" }}>
      <svg width="100%" height="100%" viewBox="50 0 1000 600">
        {usStatesPathData.map((state) => (
          <>
            <path
              key={state.name}
              d={state.path}
              fill={colors[selectedStates[state.name_short]?.party || 0]}
              stroke="white"
              strokeWidth="2.5"
              onClick={() =>
                !viewOnly ? handleStateClick(state.name_short) : null
              }
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
      {!smallView && (
        <div className="table-container">
          <table className="table">
            <tbody>
              {smallStates.map((state) => (
                <tr
                  key={state}
                  style={{
                    backgroundColor: colors[selectedStates[state].party],
                    cursor: "pointer",
                  }}
                  className="small_state"
                  onClick={() => (!viewOnly ? handleStateClick(state) : null)}
                >
                  <td>{state}</td>
                  <td>{electoralVotes[state].electoral_allocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default USMap;
