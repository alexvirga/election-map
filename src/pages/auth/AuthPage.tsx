import { useState } from "react";
import { supabase } from "../../api/supabase";
import { useSession } from "../../context/SessionContext";
import { Navigate } from "react-router-dom";

import { Typography, Box, Button, TextField } from "@mui/material";

type ExtendedAuthError = {
  message: string;
  status?: number;
  error_description?: string;
};

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false); // State for tracking if email was sent

  const { session } = useSession();

  if (session) {
    return <Navigate to="/home" />;
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      const extendedError = error as ExtendedAuthError;
      console.error(extendedError.error_description || extendedError.message);
    } else {
      setEmailSent(true); // Update state to indicate email was sent
    }
    setLoading(false);
  };

  return (
    <Box mt={2} mb={4}>
      {emailSent ? (
        <>
          <Typography p={2}>Check your email for the login link!</Typography>
          <Button
            variant="text"
            onClick={() => setEmailSent(false)} // Reset state to show the input form again
          >
            Didn't receive the email? Try again
          </Button>
        </>
      ) : (
        <>
          <Typography p={2}>
            Sign in via magic link with your email below
          </Typography>
          <form style={{ display: "flex" }} onSubmit={handleLogin}>
            <Box>
              <TextField
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                sx={{ backgroundColor: "#ffff" }}
              />
            </Box>
            <Box>
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                color="inherit"
                sx={{ height: "100%" }}
              >
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </Button>
            </Box>
          </form>
        </>
      )}
    </Box>
  );
};

export default AuthPage;
