import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../api/supabase";
import USMap from "./Map/USMap";
import { SelectedElectoralVotes } from "../types";
import Avatar from "@mui/material/Avatar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Divider,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { usStatesPathData, electoralVotes } from "../usStatesPathData";
import ElectoralBar from "../Components/ElectoralBar/ElectoralBar";
import LeagueResultsTable from "./LeagueResultsTable";
import PlaceholderMap from "./Map/PlaceholderMap";
import LeagueLeaderboard from "./LeagueLeaderboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
type Member = {
  user_id: string;
  profile: {
    username: string | null;
    electoral_predictions: SelectedElectoralVotes;
  };
};
type LeagueDetails = {
  id: number;
  createdAt: string;
  name: string;
  invite_code: string;
  buy_in?: number | null;
  owner: string;
};
export const LeagueDetails = () => {
  const { id: leagueId } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetails>();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!leagueId) {
      setStatus("Error: League ID is missing");
      console.error("League ID is undefined or missing.");
      return;
    }

    const fetchMembers = async () => {
      setStatus("Loading...");
      const { data, error } = await supabase
        .from("user_leagues")
        .select("user_id, profile(username, electoral_predictions )")
        .eq("league_id", leagueId);

      if (error) {
        setStatus(`Error fetching members: ${error.message}`);
      } else {
        setMembers(data as unknown as Member[]);
        setStatus("");
      }
    };

    const fetchLeagueDetails = async () => {
      const { data, error } = await supabase
        .from("leagues")
        .select("*")
        .eq("id", leagueId)
        .single();

      if (error) {
        setStatus(`Error fetching league: ${error.message}`);
      } else {
        setLeagueDetails(data);
      }
    };
    fetchLeagueDetails();

    fetchMembers();
  }, [leagueId]);

  const handleCopyInviteCode = () => {
    if (leagueDetails?.invite_code) {
      navigator.clipboard.writeText(leagueDetails.invite_code);
    }
  };

  // const handleMemberClick = (member: Member) => {
  //   setSelectedMember(member);
  //   console.log("members", members);
  // };

  return (
    <Box style={{ overflow: "scroll" }}>
      <Box>
        <Typography>
          League Name: <b> {leagueDetails?.name}</b>
        </Typography>
        <Typography>
          Invite Code: <b>{leagueDetails?.invite_code}</b>
          <Tooltip title="Copy to clipboard">
            <IconButton
              onClick={handleCopyInviteCode}
              aria-label="copy invite code"
              style={{ padding: "0px", marginLeft: "5px" }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Typography>
        {leagueDetails?.buy_in && (
          <>
            <Typography>
              Buy-In: <b> ${leagueDetails?.buy_in}</b>
            </Typography>
            <Typography>
              Pot: <b> ${leagueDetails?.buy_in * members.length}</b>
            </Typography>
          </>
        )}
      </Box>
      <Divider sx={{ width: "60%", margin: "24px 0px" }} />
      {/* {status && <p>{status}</p>} */}

      <Box>
        <Box style={{ maxWidth: "700px", margin: "auto" }}>
          <PlaceholderMap />
        </Box>
        <LeagueLeaderboard members={members} />
      </Box>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          placeItems: "center",
        }}
      >
        {members.map((member) => (
          <Box style={{ width: "200px" }}>
            <h4> {member.profile.username} </h4>
            {member.profile.electoral_predictions ? (
              <USMap
                setSelectedStates={() => {}}
                selectedStates={member.profile.electoral_predictions}
                viewOnly={true}
                smallView
              />
            ) : (
              <PlaceholderMap smallView />
            )}
            <Box>Score: </Box>
          </Box>
        ))}
      </Box>

      {/* <LeagueResultsTable members={members} /> */}

      {/* {selectedMember && (
        <Box>
          <h2>Prediction for {selectedMember.profile.username}</h2>
          <USMap
            selectedStates={
              selectedMember.profile.electoral_predictions || electoralVotes
            }
            setSelectedStates={() => {}}
          />
        </Box>
      )} */}
    </Box>
  );
};

export default LeagueDetails;
