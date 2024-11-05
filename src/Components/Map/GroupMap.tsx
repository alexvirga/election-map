import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
  maine,
  nebraska,
} from "../../usStatesPathData";
import "./Maps.css";
import { Box, Typography, Tooltip } from "@mui/material";

interface USMapProps {
  setSelectedStates: (states: SelectedElectoralVotes) => void;
  selectedStates: SelectedElectoralVotes;
  viewOnly?: boolean;
  smallView?: boolean;
  members: {
    user_id: string;
    profile: {
      username: string | null;
      electoral_predictions: SelectedElectoralVotes;
    };
  }[];
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

const candidates = ["Other", "Harris", "Trump"];
const maineDistricts: StateAbbreviation[] = ["ME", "ME_1", "ME_2"];
const nebraskaDistricts: StateAbbreviation[] = ["NE", "NE_1", "NE_2", "NE_3"];

const GroupMap = ({
  setSelectedStates,
  selectedStates,
  viewOnly,
  smallView,
  members,
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

  const getStatePredictionsTooltipContent = (stateAbbreviation: string) => {
    if (!Array.isArray(members) || members.length === 0) {
      return <Typography variant="body2">No predictions available</Typography>;
    }

    return (
      <>
        {members.map((member, index) => {
          const prediction = member.profile.electoral_predictions
            ? member.profile.electoral_predictions[stateAbbreviation]
            : null;

          return (
            <>
              {prediction && (
                <Typography key={index} variant="body2">
                  {member.profile.username || "Unknown"}:{" "}
                  {prediction ? candidates[prediction.party] : "N/A"}
                </Typography>
              )}
            </>
          );
        })}
      </>
    );
  };

  const getMainePattern = () => {
    const parties = [
      selectedStates["ME"].party,
      selectedStates["ME_1"].party,
      selectedStates["ME_2"].party,
    ];

    return (
      <pattern
        id="maine-striped-pattern"
        width="15"
        height="30"
        patternUnits="userSpaceOnUse"
      >
        {parties.map((party, index) => (
          <rect
            key={index}
            x={index * 5}
            width="5"
            height="30"
            fill={colors[party]}
          />
        ))}
      </pattern>
    );
  };

  const getNebraskaPattern = () => {
    const parties = [
      selectedStates["NE"].party,
      selectedStates["NE_1"].party,
      selectedStates["NE_2"].party,
      selectedStates["NE_3"].party,
    ];

    return (
      <pattern
        id="nebraska-striped-pattern"
        width="20"
        height="30"
        patternUnits="userSpaceOnUse"
      >
        {parties.map((party, index) => (
          <rect
            key={index}
            x={index * 5}
            width="5"
            height="30"
            fill={colors[party]}
          />
        ))}
      </pattern>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height="100%" viewBox="50 0 1000 600">
        {usStatesPathData.map((state) => (
          <g key={state.name}>
            <Tooltip
              title={getStatePredictionsTooltipContent(state.name_short)}
              arrow
              placement="top"
            >
              <path
                d={state.path}
                fill={colors[selectedStates[state.name_short]?.party || 0]}
                stroke="white"
                strokeWidth="2.5"
                onClick={() =>
                  !viewOnly ? handleStateClick(state.name_short) : null
                }
                style={{ cursor: "pointer" }}
              />
            </Tooltip>

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

        <defs>{getMainePattern()}</defs>
        <defs>{getNebraskaPattern()}</defs>

        {/* Render Maine */}
        <Tooltip
          title={getStatePredictionsTooltipContent("ME")}
          arrow
          placement="top"
        >
          <path
            d={maine.path}
            fill="url(#maine-striped-pattern)"
            stroke="white"
            strokeWidth="2.5"
            onClick={() => (!viewOnly ? handleStateClick("ME") : null)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>

        {/* Render Nebraska */}
        <Tooltip
          title={getStatePredictionsTooltipContent("NE")}
          arrow
          placement="top"
        >
          <path
            d={nebraska.path}
            fill="url(#nebraska-striped-pattern)"
            stroke="white"
            strokeWidth="2.5"
            onClick={() => (!viewOnly ? handleStateClick("NE") : null)}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      </svg>

      {/* Render small state boxes and district boxes */}
      {!smallView && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          {smallStates.map((state) => (
            <Tooltip
              key={state}
              title={getStatePredictionsTooltipContent(state)}
              arrow
              placement="top"
            >
              <Box
                style={{
                  backgroundColor: colors[selectedStates[state]?.party || 0],
                  border: "1px solid #ccc",
                  padding: "5px",
                  textAlign: "center",
                  margin: "2px",
                  display: "flex",
                  width: "60px",
                  justifyContent: "space-between",
                }}
                onClick={() => (!viewOnly ? handleStateClick(state) : null)}
              >
                <Typography variant="body2">{state}</Typography>
                <Typography variant="caption">
                  {electoralVotes[state].electoral_allocation}
                </Typography>
              </Box>
            </Tooltip>
          ))}

          {/* Render Maine districts */}
          {maineDistricts.map((district) => (
            <Tooltip
              key={district}
              title={getStatePredictionsTooltipContent(district)}
              arrow
              placement="top"
            >
              <Box
                style={{
                  backgroundColor: colors[selectedStates[district]?.party || 0],
                  border: "1px solid #ccc",
                  padding: "5px",
                  textAlign: "center",
                  margin: "2px",
                  display: "flex",
                  width: "60px",
                  justifyContent: "space-between",
                }}
                onClick={() => (!viewOnly ? handleStateClick(district) : null)}
              >
                <Typography variant="body2">{district}</Typography>
                <Typography variant="caption">
                  {electoralVotes[district].electoral_allocation}
                </Typography>
              </Box>
            </Tooltip>
          ))}

          {/* Render Nebraska districts */}
          {nebraskaDistricts.map((district) => (
            <Tooltip
              key={district}
              title={getStatePredictionsTooltipContent(district)}
              arrow
              placement="top"
            >
              <Box
                style={{
                  backgroundColor: colors[selectedStates[district]?.party || 0],
                  border: "1px solid #ccc",
                  padding: "5px",
                  textAlign: "center",
                  margin: "2px",
                  display: "flex",
                  width: "60px",
                  justifyContent: "space-between",
                }}
                onClick={() => (!viewOnly ? handleStateClick(district) : null)}
              >
                <Typography variant="body2">{district}</Typography>
                <Typography variant="caption">
                  {electoralVotes[district].electoral_allocation}
                </Typography>
              </Box>
            </Tooltip>
          ))}
        </Box>
      )}
    </div>
  );
};

export default GroupMap;
