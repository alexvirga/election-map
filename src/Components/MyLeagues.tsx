import { useState, useEffect } from "react";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

type League = {
  league_id: number;
  leagues: {
    name: string;
  };
};

export const MyLeagues = () => {
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
        .select("league_id, leagues(name)")
        .eq("user_id", userId);

      if (error) {
        setStatus(`Error fetching leagues: ${error.message}`);
      } else {
        setLeagues(data as unknown as League[]);
        setStatus("");
      }
    };

    fetchLeagues();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={1}>
        My Leagues
      </Typography>
      {status && <p>{status}</p>}

      {leagues.map((league) => (
        <Typography
          key={league.league_id}
          onClick={() => navigate(`/league/${league.league_id}`)}
          style={{ cursor: "pointer", width: "fit-content" }}
        >
          {league.leagues.name}
        </Typography>
      ))}
    </Box>
  );
};

export default MyLeagues;
