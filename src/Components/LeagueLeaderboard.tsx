import Table from "@mui/material/Table";

import { SelectedElectoralVotes } from "../types";
import {
  Skeleton,
  Box,
  Typography,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

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
        <TableBody>
          {members.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton animation={false} sx={{ maxWidth: "300px" }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default LeagueLeaderboard;
