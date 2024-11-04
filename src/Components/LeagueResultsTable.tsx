import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { SelectedElectoralVotes } from "../types";
import { states } from "../usStatesPathData";

type Member = {
  user_id: string;
  profile: {
    username: string | null;
    electoral_predictions: SelectedElectoralVotes;
  };
};

interface LeagueResultsTableProps {
  members: Member[];
}
export const LeagueResultsTable = ({ members }: LeagueResultsTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>State</TableCell>
            {members.map((member) => (
              <TableCell key={member.user_id} align="center">
                {member.profile.username || "N/A"}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {states.map((state) => (
            <TableRow key={state}>
              <TableCell>{state}</TableCell>
              {members.map((member) => (
                <TableCell key={member.user_id} align="center">
                  {member.profile.electoral_predictions?.[state]
                    ? member.profile.electoral_predictions[state].party === 1
                      ? "Harris"
                      : member.profile.electoral_predictions[state].party === 2
                      ? "Trump"
                      : ""
                    : "No data"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeagueResultsTable;
