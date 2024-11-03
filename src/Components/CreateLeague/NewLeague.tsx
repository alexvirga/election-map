import { useState } from "react";
import { supabase } from "../../api/supabase";

export const NewLeague = () => {
  const [leagueName, setLeagueName] = useState("");
  const [status, setStatus] = useState("");

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Creating league...");

    // Get the current user from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session || !session.user) {
      setStatus("Error: User not authenticated");
      return;
    }

    const userId = session.user.id;
    const inviteCode = generateInviteCode();

    // Insert the new league
    const { data: leagueData, error: leagueError } = await supabase
      .from("leagues")
      .insert([
        {
          name: leagueName,
          invite_code: inviteCode,
        },
      ])
      .select();

    if (leagueError) {
      setStatus(`Error: ${leagueError.message}`);
      return;
    }

    const newLeague = leagueData[0];

    // Add the user to the user_leagues table
    const { error: userLeagueError } = await supabase
      .from("user_leagues")
      .insert([
        {
          user_id: userId,
          league_id: newLeague.id,
        },
      ]);

    if (userLeagueError) {
      setStatus(`Error adding user to league: ${userLeagueError.message}`);
    } else {
      setStatus(`League created successfully! Invite code: ${inviteCode}`);
    }

    setLeagueName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          League Name:
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create League</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default NewLeague;
