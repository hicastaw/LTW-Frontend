import React, { useContext, useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * UserList – hiển thị danh sách users trong sidebar.
 * Dùng fetchModel để lấy data từ backend API.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setTopBarTitle } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setTopBarTitle("Users");
    fetchModel("/api/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [setTopBarTitle]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
        Users
      </Typography>
      <Divider />
      <List component="nav" dense>
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(`/users/${user._id}`)}
                id={`user-list-item-${user._id}`}
              >
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
