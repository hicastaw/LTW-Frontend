import './App.css';

import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { authFetch } from "./lib/fetchModelData";
import AppLayout from "./components/AppLayout";

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
        <AppLayout />
      </Router>
    </AppContext.Provider>
  );
};

export default App;

