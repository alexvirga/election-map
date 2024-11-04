import { useState } from "react";
import { supabase } from "../../api/supabase";
import { Button, TextField } from "@mui/material";

export const JoinLeague = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    setStatus("Joining league...");

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !session.user) {
      setStatus("Error: User not authenticated");
      return;
    }

    const userId = session.user.id;

    // Check if the league with the given invite code exists
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

    // Check if the user is already in the league
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
    const { error: userLeagueError } = await supabase
      .from("user_leagues")
      .insert([
        {
          user_id: userId,
          league_id: leagueId,
        },
      ]);

    if (userLeagueError) {
      setStatus(`Error joining league: ${userLeagueError.message}`);
    } else {
      setStatus("Successfully joined the league!");
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
      />

      <Button onClick={handleSubmit}>Join League</Button>

      {status && <p>{status}</p>}
    </div>
  );
};

export default JoinLeague;
