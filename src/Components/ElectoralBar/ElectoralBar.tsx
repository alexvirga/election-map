import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface ElectoralBarProps {
  democratVotes: number;
  republicanVotes: number;
}

export const ElectoralBar = ({
  democratVotes,
  republicanVotes,
}: ElectoralBarProps) => {
  const demBarPercentage = democratVotes / 538;
  const repBarPercentage = republicanVotes / 538;
  const undecidedBarPercentage =
    (538 - (democratVotes + republicanVotes)) / 538;

  return (
    <div style={{ margin: "10px 0px 30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ color: "#1375b7" }}>Harris: {democratVotes}</h4>{" "}
        <h4 style={{ color: "#c93135" }}> Trump: {republicanVotes} </h4>
      </div>

      <div>
        <div
          style={{
            borderRadius: "5px",
            width: "100%",
            height: "40px",
            marginBottom: "10px",
            display: "block",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "-15px",
              bottom: "-15px",
              width: "2px",
              backgroundColor: "#7a7a7a",
              zIndex: 1,
              height: "70px",
            }}
          />
          <div
            style={{
              background: "#1375b7",
              width: `${demBarPercentage * 100}%`,
              height: "100%",
              display: "inline-block",
            }}
          />
          <div
            style={{
              background: "lightgrey",
              width: `${undecidedBarPercentage * 100}%`,
              height: "100%",
              display: "inline-block",
            }}
          />
          <div
            style={{
              background: "#c93135",
              width: `${repBarPercentage * 100}%`,
              height: "100%",
              display: "inline-block",
            }}
          />
        </div>
        {/* <h2>Republican: {republicanVotes} / 270</h2>
        <div style={{ background: "lightgray", width: "100%", height: "20px" }}>
          <div
            style={{
              background: "red",
              width: `${(republicanVotes / 270) * 100}%`,
              height: "100%",
            }}
          ></div>
        </div> */}
      </div>
    </div>
  );
};

export default ElectoralBar;
