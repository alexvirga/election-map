import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { SelectedElectoralVotes } from "../types";
import { Skeleton, TableRow, Box, Typography } from "@mui/material";

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
        {members.map((member) => (
          <Skeleton animation={false} sx={{ maxWidth: "300px" }} />
        ))}
      </Table>
    </Box>
  );
};

export default LeagueLeaderboard;
