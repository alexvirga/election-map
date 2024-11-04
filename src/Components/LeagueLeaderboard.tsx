import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { SelectedElectoralVotes } from "../types";
import { TableRow } from "@mui/material";

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
  console.log("leaderboard");
  return (
    <div>
      <h4> Leaderboard </h4>
      <Table>
        {members.map((member) => (
          <TableRow>{member.profile.username}</TableRow>
        ))}
      </Table>
    </div>
  );
};

export default LeagueLeaderboard;
