import { Box, Typography } from "@mui/material";
import {
  usStatesPathData,
  electoralVotes,
  maine,
  nebraska,
} from "../../usStatesPathData";

import "./Maps.css";

type StateAbbreviation = keyof typeof electoralVotes;

interface USMapPlaceholderProps {
  smallView?: boolean;
}

export const PlaceholderMap = ({ smallView }: USMapPlaceholderProps) => {
  const smallStates: StateAbbreviation[] = [
    "MA",
    "RI",
    "CT",
    "NJ",
    "DE",
    "MD",
    "DC",
  ];

  const allStates = [...usStatesPathData, maine, nebraska];
  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height="100%" viewBox="50 0 1000 600">
        {allStates.map((state) => (
          <g key={state.name}>
            <path
              key={state.name}
              d={state.path}
              fill={"#d6d6d6"}
              stroke="white"
              strokeWidth="2.5"
              //   style={{ cursor: "pointer" }}
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
          </g>
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
                    backgroundColor: "#d6d6d6",
                  }}
                  className="small_state"
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
        <Box style={{ display: "flex" }}>
          <Box mr={2}>
            <Typography> Maine </Typography>
            <Box style={{ display: "flex" }}>
              <Box
                className="state_extra"
                style={{ backgroundColor: "#d6d6d6" }}
              >
                2
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: "#d6d6d6",
                }}
              >
                1
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: "#d6d6d6",
                }}
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
                style={{ backgroundColor: "#d6d6d6" }}
              >
                2
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: "#d6d6d6",
                }}
              >
                1
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: "#d6d6d6",
                }}
              >
                1
              </Box>
              <Box
                className="state_extra"
                style={{
                  backgroundColor: "#d6d6d6",
                }}
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
export default PlaceholderMap;
