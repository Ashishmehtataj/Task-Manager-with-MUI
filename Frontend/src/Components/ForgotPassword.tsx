import axios from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const API = "http://localhost:7000/user";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${API}/forgotpassword`,
        { email }
      );

      setMessage(data.message);
      toast.success(data.message);
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#111827",
              mb: 1,
            }}
          >
            Forgot Password
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#6b7280",
              mb: 4,
            }}
          >
            Enter your registered email address
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Send Reset Link
            </Button>

            {message && (
              <Typography
                sx={{
                  mt: 3,
                  textAlign: "center",
                  color: "success.main",
                  fontWeight: 500,
                }}
              >
                {message}
              </Typography>
            )}

            <Typography
              sx={{
                textAlign: "center",
                mt: 3,
                color: "#6b7280",
              }}
            >
              Remember your password?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;