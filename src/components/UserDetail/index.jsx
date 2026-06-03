import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

/**
 * UserDetail – hiển thị thông tin chi tiết của một user.
 * Dùng fetchModel để lấy data từ backend API.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { setTopBarTitle } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await fetchModel(`/api/user/${userId}`);
        setUser(data);
        setTopBarTitle(`${data.first_name} ${data.last_name}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, setTopBarTitle]);

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

  if (!user) {
    return <Typography variant="body1" sx={{ p: 2 }}>User not found.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {user.first_name} {user.last_name}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {user.location && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body1">{user.location}</Typography>
          </Box>
        )}

        {user.occupation && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Occupation
            </Typography>
            <Typography variant="body1">{user.occupation}</Typography>
          </Box>
        )}

        {user.description && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{user.description}</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          id={`view-photos-btn-${userId}`}
          variant="contained"
          color="primary"
          onClick={() => navigate(`/photos/${userId}`)}
        >
          View Photos
        </Button>
      </Box>
    </Box>
  );
}

export default UserDetail;
