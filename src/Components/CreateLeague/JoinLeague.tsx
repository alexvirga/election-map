import { useState } from "react";
import { supabase } from "../../api/supabase";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

export const JoinLeague = () => {
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

    console.log(data);
    if (userLeagueError) {
      setStatus(`Error joining league: ${userLeagueError.message}`);
    } else {
      navigate(`/league/${data[0].league_id}`);
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
        size={"small"}
      />

      <Button color="inherit" onClick={handleSubmit}>
        Join League
      </Button>

      {status && <p>{status}</p>}
    </div>
  );
};

export default JoinLeague;
