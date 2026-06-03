import './App.css';

import React, { useState, useEffect } from "react";
import { Grid, Paper, CircularProgress, Box } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { authFetch } from "./lib/fetchModelData";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import Login from "./components/Login";
import Register from "./components/Register";

// Context để share thông tin về view hiện tại và auth state
export const AppContext = React.createContext(null);

const App = () => {
  const [topBarTitle, setTopBarTitle] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [advancedFeatures, setAdvancedFeatures] = useState(false);
  // true trong khi đang verify token với server
  const [checking, setChecking] = useState(true);

  // Khi app khởi động: kiểm tra token còn hạn không
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const res = await authFetch("/api/admin/me");
        if (res.ok) {
          const user = await res.json();
          if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
            setLoggedInUser(user);
          }
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, []);

  // Hiển thị loading trong lúc verify token
  if (checking) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppContext.Provider value={{ topBarTitle, setTopBarTitle, loggedInUser, setLoggedInUser, advancedFeatures, setAdvancedFeatures }}>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />

            {loggedInUser ? (
              // Đã đăng nhập: layout chính
              <>
                <Grid item sm={3}>
                  <Paper className="main-grid-item">
                    <UserList />
                  </Paper>
                </Grid>
                <Grid item sm={9}>
                  <Paper className="main-grid-item">
                    <Routes>
                      <Route path="/users/:userId" element={<UserDetail />} />
                      <Route path="/photos/:userId" element={<UserPhotos />} />
                      <Route path="/photos/:userId/:photoId" element={<UserPhotos />} />
                      <Route path="/comments/:userId" element={<UserComments />} />
                      <Route path="/users" element={<UserList />} />
                      <Route path="*" element={<Navigate to={`/users/${loggedInUser._id}`} replace />} />
                    </Routes>
                  </Paper>
                </Grid>
              </>
            ) : (
              // Chưa đăng nhập: 2 trang riêng /login và /register
              <Grid item sm={12}>
                <Paper className="main-grid-item">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Paper>
              </Grid>
            )}
          </Grid>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
