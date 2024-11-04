import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

interface FormDialogProps {
  open: boolean;
  handleClose: () => void;
}

const NewLeagueDialog = ({ open, handleClose }: FormDialogProps) => {
  const [, setStatus] = useState("");
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

  const handleSubmit = async () => {
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
    // Insert the new league
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

    handleClose();
    navigate(`/league/${newLeague.id}`);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New League</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="League Name"
          type="text"
          fullWidth
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Buy-In (Optional)"
          type="number"
          fullWidth
          variant="outlined"
          name="buy_in"
          value={formData.buy_in}
          onChange={handleChange}
          required={false}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewLeagueDialog;
