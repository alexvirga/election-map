import { Skeleton, Box, Typography } from "@mui/material";

type Member = {
  user_id: string;
  profile: {
    username: string | null;
    electoral_predictions: any;
  };
};

interface LeagueLeaderboardProps {
  members: Member[];
}

export const LeagueLeaderboard = ({ members }: LeagueLeaderboardProps) => {
  return (
    <Box>
      <Typography>Leaderboard</Typography>
      <Box>
        {members.map((_, idx) => (
          <Box key={idx} sx={{ display: "flex", mb: 1 }}>
            <Skeleton
              animation={false}
              sx={{ width: "100%", maxWidth: "300px" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LeagueLeaderboard;
