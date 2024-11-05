import { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

type League = {
  league_id: number;
  leagues: {
    name: string;
    invite_code: string;
  };
};

interface Props {
  triggerRefetch: boolean;
}
export const MyLeagues = ({ triggerRefetch }: Props) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeagues = async () => {
      setStatus("Loading...");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || !session.user) {
        setStatus("Error: User not authenticated");
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("user_leagues")
        .select("league_id, leagues(name, invite_code)")
        .eq("user_id", userId);

      if (error) {
        setStatus(`Error fetching leagues: ${error.message}`);
      } else {
        setLeagues(data as unknown as League[]);
        setStatus("");
      }
    };

    fetchLeagues();
  }, [triggerRefetch]);

  return (
    <Box
      minHeight={80}
      sx={{
        color: "#ffffff",
      }}
    >
      <Typography mb={1} sx={{ color: "#ffffff" }}>
        My Leagues
      </Typography>
      {status && <Typography sx={{ color: "#ff4d4d" }}>{status}</Typography>}
      <Box
        sx={{
          maxHeight: "120px",
          overflowY: "scroll", // Shows only the vertical scroll bar
          overflowX: "hidden", // Ensures horizontal scroll bar is hidden
          "&::-webkit-scrollbar": {
            width: "8px", // Vertical scroll bar width
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ffffff", // White color for the thumb
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#333333", // Darker color for the track
          },
        }}
      >
        {leagues.map((league) => (
          <Typography
            key={league.league_id}
            onClick={() => navigate(`/league/${league.leagues.invite_code}`)}
            sx={{
              cursor: "pointer",
              color: "#b3b3b3", // Light gray for clickable items
              "&:hover": {
                color: "#ffffff",
              },
              width: "fit-content",
              marginBottom: 1,
            }}
            variant="body2"
          >
            {league.leagues.name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default MyLeagues;
