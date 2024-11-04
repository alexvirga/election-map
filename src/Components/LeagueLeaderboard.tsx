import Table from "@mui/material/Table";

import { SelectedElectoralVotes } from "../types";
import { Skeleton, Box, Typography } from "@mui/material";

type Member = {
  user_id: string;
  profile: {
    username: string | null;
    electoral_predictions: SelectedElectoralVotes;
  };
};

interface LeagueLeaderboardProps {
  members: Member[];
}

export const LeagueLeaderboard = ({ members }: LeagueLeaderboardProps) => {
  return (
    <Box>
      <Typography> Leaderboard </Typography>
      <Table>
        {members.map((_, idx) => (
          <Skeleton key={idx} animation={false} sx={{ maxWidth: "300px" }} />
        ))}
      </Table>
    </Box>
  );
};

export default LeagueLeaderboard;
