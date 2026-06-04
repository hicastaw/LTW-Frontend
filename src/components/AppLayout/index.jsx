import React, { useContext } from "react";
import { Grid, Paper } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import { AppContext } from "../../App";

import TopBar from "../TopBar";
import UserDetail from "../UserDetail";
import UserList from "../UserList";
import UserPhotos from "../UserPhotos";
import UserComments from "../UserComments";
import Login from "../Login";
import Register from "../Register";

function AppLayout() {
  const { loggedInUser } = useContext(AppContext);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <div className="main-topbar-buffer" />

        {loggedInUser ? (
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
  );
}

export default AppLayout;
