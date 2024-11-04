import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../api/supabase";
import USMap from "./Map/USMap";
import { SelectedElectoralVotes } from "../types";
import { Divider, Box, Typography, Tooltip, IconButton } from "@mui/material";
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
  const { invite_code } = useParams<{ invite_code: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetails>();

  const [, setStatus] = useState("");

  useEffect(() => {
    if (!invite_code) {
      setStatus("Error: Invite code is missing");
      console.error("Invite code is undefined or missing.");
      return;
    }

    const fetchLeagueDetails = async () => {
      setStatus("Loading...");
      const { data: leagueData, error: leagueError } = await supabase
        .from("leagues")
        .select("*")
        .eq("invite_code", invite_code)
        .single();

      if (leagueError) {
        setStatus(`Error fetching league: ${leagueError.message}`);
        return;
      } else {
        setLeagueDetails(leagueData);
        setStatus("");
      }

      // Fetch members after ensuring the league exists
      const { data: memberData, error: memberError } = await supabase
        .from("user_leagues")
        .select("user_id, profile(username, electoral_predictions)")
        .eq("league_id", leagueData.id);

      if (memberError) {
        setStatus(`Error fetching members: ${memberError.message}`);
      } else {
        setMembers(memberData as unknown as Member[]);
        setStatus("");
      }
    };

    fetchLeagueDetails();
  }, [invite_code]);

  const handleCopyInviteCode = () => {
    if (leagueDetails?.invite_code) {
      navigator.clipboard.writeText(leagueDetails.invite_code);
    }
  };

  return (
    <Box style={{ overflow: "scroll" }}>
      <Box>
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
      </Box>
      <Divider sx={{ width: "60%", margin: "24px auto" }} />
      <Box>
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            borderBottom: "1px solid #f5c6cb",
          }}
        >
          Picks from others will remain hidden until 6 PM on Tuesday.
        </div>
      </Box>
      {/* {status && <p>{status}</p>} */}

      <Box>
        <Box style={{ maxWidth: "700px", margin: "auto" }}>
          <PlaceholderMap />
        </Box>
      </Box>
      <Divider sx={{ width: "60%", margin: "24px auto" }} />
      <LeagueLeaderboard members={members} />
      <Divider sx={{ width: "60%", margin: "24px auto" }} />
      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          placeItems: "center",
        }}
      >
        {members.map((member, idx) => (
          <Box style={{ width: "200px" }} key={idx}>
            <Typography variant="body1"> {member.profile.username} </Typography>
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LeagueDetails;
