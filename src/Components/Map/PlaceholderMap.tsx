import {
  usStatesPathData,
  electoralVotes,
  SelectedElectoralVotes,
} from "../../usStatesPathData";

export const PlaceholderMap = () => {
  return (
    <div>
      <svg width="100%" height="100%" viewBox="50 0 1000 600">
        {usStatesPathData.map((state) => (
          <>
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
          </>
        ))}
      </svg>
    </div>
  );
};
export default PlaceholderMap;
