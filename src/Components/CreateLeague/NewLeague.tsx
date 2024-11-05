import { useState } from "react";
import { supabase } from "../../api/supabase";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
  setTriggerRefetch: (triggerRefetch: boolean) => void;
}
export const NewLeague = ({ setIsDrawerOpen, setTriggerRefetch }: Props) => {
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
      setStatus("");
      navigate(`/league/${newLeague.invite_code}`);

      setFormData({ name: "", buy_in: null });
      setTriggerRefetch(false);
      setIsDrawerOpen(false);
    }
  };

  return (
    <div>
      <TextField
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
        onClick={handleSubmit}
        color="inherit"
        sx={{
          backgroundColor: "#444",
          color: "#ffffff",
          marginTop: 2,
          "&:hover": { backgroundColor: "#555" },
        }}
      >
        Create
      </Button>
      {status && <p style={{ color: "#ff4d4d", marginTop: 2 }}>{status}</p>}
    </div>
  );
};

export default NewLeague;
