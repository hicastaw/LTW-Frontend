import React, { useContext, useState } from "react";
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
import { AppContext } from "../../App";
import { BASE_URL } from "../../lib/fetchModelData";


// Login – Trang đăng nhập độc lập.

function Login() {
  const { setLoggedInUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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
        body: JSON.stringify({ login_name: loginName, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Đăng nhập thất bại.");
        return;
      }
      localStorage.setItem("authToken", data.token);
      const userInfo = { _id: data._id, first_name: data.first_name, last_name: data.last_name, login_name: data.login_name };
      localStorage.setItem("authUser", JSON.stringify(userInfo));
      setLoggedInUser(userInfo);
    } catch (err) {
      setLoginError("Lỗi kết nối đến server.");
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
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
          Đăng Nhập
        </Typography>
        <Divider sx={{ mb: 3 }} />

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

          <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            Chưa có tài khoản?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
              sx={{ cursor: "pointer" }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
