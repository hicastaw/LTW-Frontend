import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8081";

/**
 * Register – Trang đăng ký tài khoản mới, độc lập.
 */
function Register() {
  const navigate = useNavigate();

  const [regForm, setRegForm] = useState({
    login_name: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setRegError("");
    setRegSuccess("");

    if (!regForm.login_name || !regForm.first_name || !regForm.last_name || !regForm.password) {
      setRegError("Login name, Tên, Họ và Mật khẩu là bắt buộc.");
      return;
    }
    if (regForm.password !== regForm.confirm_password) {
      setRegError("Hai mật khẩu không khớp.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          login_name: regForm.login_name,
          password: regForm.password,
          first_name: regForm.first_name,
          last_name: regForm.last_name,
          location: regForm.location,
          description: regForm.description,
          occupation: regForm.occupation,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || "Đăng ký thất bại.");
        return;
      }
      setRegSuccess(`Đăng ký thành công! Login name: ${data.login_name}. Bạn có thể đăng nhập.`);
      setRegForm({
        login_name: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
      });
    } catch (err) {
      setRegError("Lỗi kết nối đến server.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 480 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
          Đăng Ký Tài Khoản Mới
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {regError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {regError}
          </Alert>
        )}
        {regSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {regSuccess}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            id="reg-login-name"
            label="Login Name *"
            name="login_name"
            variant="outlined"
            fullWidth
            value={regForm.login_name}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-first-name"
            label="Tên *"
            name="first_name"
            variant="outlined"
            fullWidth
            value={regForm.first_name}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-last-name"
            label="Họ *"
            name="last_name"
            variant="outlined"
            fullWidth
            value={regForm.last_name}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-password"
            label="Mật khẩu *"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={regForm.password}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-confirm-password"
            label="Xác nhận mật khẩu *"
            name="confirm_password"
            type="password"
            variant="outlined"
            fullWidth
            value={regForm.confirm_password}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-location"
            label="Địa điểm"
            name="location"
            variant="outlined"
            fullWidth
            value={regForm.location}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-occupation"
            label="Nghề nghiệp"
            name="occupation"
            variant="outlined"
            fullWidth
            value={regForm.occupation}
            onChange={handleRegChange}
          />
          <TextField
            id="reg-description"
            label="Mô tả bản thân"
            name="description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={regForm.description}
            onChange={handleRegChange}
          />
          <Button
            id="register-btn"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleRegister}
            size="large"
          >
            Register Me
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            Đã có tài khoản?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{ cursor: "pointer" }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
