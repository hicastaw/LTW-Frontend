import React, { useContext, useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import fetchModel, { BASE_URL } from "../../lib/fetchModelData";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  
  const [userLoading, setUserLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { setTopBarTitle } = useContext(AppContext);
  const navigate = useNavigate();

  // Luồng 1: Chỉ lo lấy thông tin User
  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const user = await fetchModel(`/api/user/${userId}`);
        const name = `${user.first_name} ${user.last_name}`;
        setUserName(name);
        setTopBarTitle(`Comments of ${name}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [userId, setTopBarTitle]);

  // Luồng 2: Chỉ lo lấy thông tin Comments
  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const commentsData = await fetchModel(`/api/user/comments/${userId}`);
        setComments(commentsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [userId]);

  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {userLoading ? (
        <CircularProgress size={24} sx={{ mb: 2 }} />
      ) : (
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Comments of {userName}
        </Typography>
      )}
      
      {commentsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Typography variant="body1">No comments found for this user.</Typography>
      ) : (
        <Paper elevation={2}>
          <List>
            {comments.map((item, index) => (
              <React.Fragment key={item._id}>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => navigate(`/photos/${item.photo.user_id}/${item.photo._id}`)}
                    sx={{ alignItems: 'flex-start', py: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="square" 
                        src={`${BASE_URL}/images/${item.photo.file_name}`} 
                        alt="thumbnail"
                        sx={{ width: 80, height: 80, mr: 2, borderRadius: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                          {item.comment}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Posted on: {formatDate(item.date_time)}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < comments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default UserComments;
