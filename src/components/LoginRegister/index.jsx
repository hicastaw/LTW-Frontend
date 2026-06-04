import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { AppContext } from "../../App";

const BASE_URL = "http://localhost:8081";

/**
 * LoginRegister – hiển thị form đăng nhập và đăng ký.
 */
function LoginRegister() {
  const { setLoggedInUser } = useContext(AppContext);

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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

  const handleLogin = async () => {
    setLoginError("");
    if (!loginName.trim()) {
      setLoginError("Vui lòng nhập login name.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login_name: loginName, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Đăng nhập thất bại.");
        return;
      }
      setLoggedInUser(data);
    } catch (err) {
      setLoginError("Lỗi kết nối đến server.");
    }
  };

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
    <Box sx={{ display: "flex", gap: 4, p: 3, flexWrap: "wrap" }}>
      {/* ─── Login Form ─── */}
      <Paper elevation={3} sx={{ p: 3, flex: 1, minWidth: 280 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Đăng Nhập
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            id="login-name"
            label="Login Name"
            variant="outlined"
            fullWidth
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <TextField
            id="login-password"
            label="Mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button
            id="login-btn"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            size="large"
          >
            Đăng Nhập
          </Button>
        </Box>
      </Paper>

      {/* ─── Register Form ─── */}
      <Paper elevation={3} sx={{ p: 3, flex: 1, minWidth: 280 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Đăng Ký Tài Khoản Mới
        </Typography>
        <Divider sx={{ mb: 2 }} />

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
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginRegister;
