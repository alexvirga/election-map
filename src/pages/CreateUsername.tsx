import { useState } from "react";
import { createProfile } from "../api/api";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { supabase } from "../api/supabase";

export const CreateUserName = () => {
  const [username, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();

  if (!user) {
    return <Typography variant="h6">No user found. Please log in.</Typography>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUserName(e.target.value);
  };

  const validateUsername = () => {
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return false;
    }
    if (username.trim().length > 15) {
      setError("Username must be 15 characters or fewer.");
      return false;
    }
    if (/[^a-zA-Z0-9_]/.test(username)) {
      setError(
        "Username must contain only valid characters (letters, numbers, and underscores)."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateUsername()) {
      return;
    }

    const { success } = await createProfile(user?.id, username);

    if (success) {
      navigate(`/`);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          backgroundColor: "white",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Create Your Username
            </Typography>

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={handleChange}
              error={!!error}
              helperText={error}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              sx={{ py: 1.5 }}
              onClick={handleSubmit}
            >
              Continue
            </Button>

            <Button
              variant="text"
              color="inherit"
              onClick={() => supabase.auth.signOut()}
              sx={{ width: "120px", mt: "30px", fontSize: "x-small" }}
            >
              Sign Out
            </Button>
          </Paper>
        </Container>
      </Box>

      <Box
        sx={{
          flex: 3,
        }}
      />
    </Box>
  );
};

export default CreateUserName;
