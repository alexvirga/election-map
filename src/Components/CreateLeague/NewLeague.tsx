import { useState } from "react";
import { supabase } from "../../api/supabase";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NewLeague = () => {
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    buy_in?: string;
  }>({});
  const [formData, setFormData] = useState<{
    name: string;
    buy_in: number | null;
  }>({
    name: "",
    buy_in: null,
  });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { name?: string; buy_in?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "League name is required.";
    }

    if (
      formData.buy_in !== null &&
      (isNaN(formData.buy_in) || formData.buy_in < 0)
    ) {
      newErrors.buy_in = "Buy-in must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setStatus("Creating league...");

    const generateInviteCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

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

    const { name, buy_in } = formData;

    const { data: leagueData, error: leagueError } = await supabase
      .from("leagues")
      .insert([
        {
          name: name,
          buy_in: buy_in,
          invite_code: inviteCode,
          owner: userId,
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
    }

    navigate(`/league/${newLeague.id}`);
  };

  return (
    <div>
      <TextField
        autoFocus
        margin="dense"
        label="League Name"
        type="text"
        variant="outlined"
        name="name"
        value={formData.name}
        error={!!errors.name}
        helperText={errors.name}
        onChange={handleChange}
        required
      />
      <TextField
        margin="dense"
        label="Buy-In (Optional)"
        type="number"
        variant="outlined"
        name="buy_in"
        value={formData.buy_in}
        error={!!errors.buy_in}
        helperText={errors.buy_in}
        onChange={handleChange}
        required={false}
      />
      <Button onClick={handleSubmit} color="inherit">
        Create
      </Button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default NewLeague;
