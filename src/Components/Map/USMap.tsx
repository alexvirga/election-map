import React, { useState } from "react";
import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
} from "../../usStatesPathData";
import "./Maps.css";
import { Box, Typography } from "@mui/material";

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
      {!smallView && (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <Box mr={2}>
            <Typography> Maine </Typography>
            <Box style={{ display: "flex" }}>
              <Box
                className="state_extra"
                style={{ backgroundColor: colors[selectedStates["ME"].party] }}
                onClick={() => (!viewOnly ? handleStateClick("ME") : null)}
              >
                2
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: colors[selectedStates["ME_1"].party],
                }}
                onClick={() => (!viewOnly ? handleStateClick("ME_1") : null)}
              >
                1
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: colors[selectedStates["ME_2"].party],
                }}
                onClick={() => (!viewOnly ? handleStateClick("ME_2") : null)}
              >
                1
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography> Nebraska </Typography>
            <Box style={{ display: "flex" }}>
              <Box
                className="state_extra"
                style={{ backgroundColor: colors[selectedStates["NE"].party] }}
                onClick={() => (!viewOnly ? handleStateClick("NE") : null)}
              >
                2
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: colors[selectedStates["NE_1"].party],
                }}
                onClick={() => (!viewOnly ? handleStateClick("NE_1") : null)}
              >
                1
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: colors[selectedStates["NE_2"].party],
                }}
                onClick={() => (!viewOnly ? handleStateClick("NE_2") : null)}
              >
                1
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: colors[selectedStates["NE_3"].party],
                }}
                onClick={() => (!viewOnly ? handleStateClick("NE_3") : null)}
              >
                1
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default USMap;
