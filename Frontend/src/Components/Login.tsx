import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [loginform, setLoginform] = useState<LoginData>({
    email: "",
    password: "",
  });

  const API = "http://localhost:7000/user";
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginform({
      ...loginform,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const user = await axios.post(
        `${API}/login`,
        loginform
      );

      if (user.data.success) {
        toast.success(user.data.message);

        localStorage.setItem(
          "token",
          user.data.token
        );

        localStorage.setItem(
          "login",
          "true"
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(
          err.response.data.message
        );
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
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.08)",
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
            Welcome Back 👋
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#6b7280",
              mb: 4,
            }}
          >
            Login to your account
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={loginform.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={loginform.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Link
                to="/forgotpassword"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontSize: "14px",
                }}
              >
                Forgot Password?
              </Link>
            </Box>

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
              Log In
            </Button>

            <Typography
              sx={{
                textAlign: "center",
                mt: 3,
                color: "#6b7280",
              }}
            >
              Need an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Register Here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}