import React, { useContext, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { authFetch } from "../../lib/authFetch";
import "./styles.css";

const BASE_URL = "http://localhost:8081";

/**
 * TopBar – AppBar với auth state và context view.
 */
function TopBar() {
  const { topBarTitle, setTopBarTitle, loggedInUser, setLoggedInUser } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Logout: xóa token + user khỏi localStorage
  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/admin/logout`, { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setTopBarTitle("");
    setLoggedInUser(null);
    navigate("/");
  };

  // Trigger file input click
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  // Upload photo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await authFetch("/api/photo/new", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // Navigate to current user's photos to see the new photo
        navigate(`/photos/${loggedInUser._id}`);
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.error}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    }

    // Reset file input
    e.target.value = "";
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        {/* Tên app bên trái */}
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Photo Sharing App
        </Typography>

        {/* Context bên phải */}
        {topBarTitle && (
          <Typography variant="h6" color="inherit" sx={{ mr: 3 }}>
            {topBarTitle}
          </Typography>
        )}

        {loggedInUser ? (
          // Đã đăng nhập
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" color="inherit">
              Hi {loggedInUser.first_name}
            </Typography>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <Button
              id="add-photo-btn"
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleAddPhotoClick}
            >
              Add Photo
            </Button>

            <Button
              id="logout-btn"
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        ) : (
          // Chưa đăng nhập
          <Typography variant="body1" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
