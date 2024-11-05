import { useState } from "react";
import { supabase } from "../../api/supabase";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

interface Props {
  setTriggerRefetch: (triggerRefetch: boolean) => void;
}
export const JoinLeague = ({ setTriggerRefetch }: Props) => {
  const [inviteCode, setInviteCode] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<{ inviteCode?: string }>({});
  const { session } = useSession();

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { inviteCode?: string } = {};

    if (!inviteCode.trim()) {
      newErrors.inviteCode = "Invite code is required.";
    } else if (inviteCode.length !== 6) {
      newErrors.inviteCode = "Invite code must be 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const userId = session?.user.id;

    const { data: leagueData, error: leagueError } = await supabase
      .from("leagues")
      .select("id")
      .eq("invite_code", inviteCode)
      .single();

    if (leagueError || !leagueData) {
      setStatus("Error: Invalid invite code");
      return;
    }

    const leagueId = leagueData.id;

    const { data: existingMembership, error: membershipError } = await supabase
      .from("user_leagues")
      .select("id")
      .eq("user_id", userId)
      .eq("league_id", leagueId);

    if (membershipError) {
      setStatus(`Error checking membership: ${membershipError.message}`);
      return;
    }

    if (existingMembership && existingMembership.length > 0) {
      setStatus("You are already a member of this league.");
      return;
    }

    // Add the user to the user_leagues table
    const { data, error: userLeagueError } = await supabase
      .from("user_leagues")
      .insert([
        {
          user_id: userId,
          league_id: leagueId,
        },
      ])
      .select();

    if (userLeagueError) {
      setStatus(`Error joining league: ${userLeagueError.message}`);
    } else {
      navigate(`/league/${inviteCode}`);
      setTriggerRefetch(true);
    }

    setInviteCode("");
  };

  return (
    <div>
      <TextField
        type="text"
        label="Invite Code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        required
        error={!!errors.inviteCode}
        helperText={errors.inviteCode}
        size="small"
        sx={{
          input: { color: "#ffffff" },
          label: {
            color: "#b3b3b3",
            "&.Mui-focused": {
              color: "#ffffff", // Ensure the label stays white when focused
            },
          },
          backgroundColor: "#333333",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#555555",
            },
            "&:hover fieldset": {
              borderColor: "#777777",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffffff",
            },
          },
        }}
      />

      <Button
        color="inherit"
        onClick={handleSubmit}
        sx={{
          backgroundColor: "#444",
          color: "#ffffff",
          marginTop: 2,
          "&:hover": { backgroundColor: "#555" },
        }}
      >
        Join League
      </Button>

      {status && (
        <Typography
          variant="body2"
          style={{ color: "#ff4d4d", marginTop: "5px" }}
        >
          {status}
        </Typography>
      )}
    </div>
  );
};

export default JoinLeague;
