import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Link,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import fetchModel, { authFetch, BASE_URL } from "../../lib/fetchModelData";
import "./styles.css";

/**
 * Format date thành chuỗi đọc được.
 */
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

/**
 * UserPhotos – hiển thị tất cả ảnh của user kèm comments và form thêm comment.
 * Hỗ trợ Stepper view nếu bật Advanced Features.
 */
function UserPhotos() {
  const { userId, photoId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  
  const [userLoading, setUserLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Comment input state: { [photoId]: string }
  const [commentText, setCommentText] = useState({});
  const [commentError, setCommentError] = useState({});
  const { setTopBarTitle, advancedFeatures } = useContext(AppContext);
  const navigate = useNavigate();

  // Luồng 1: Chỉ lo lấy thông tin User
  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const user = await fetchModel(`/api/user/${userId}`);
        const name = `${user.first_name} ${user.last_name}`;
        setUserName(name);
        setTopBarTitle(`Photos of ${name}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, [userId, setTopBarTitle]);

  // Luồng 2: Chỉ lo lấy thông tin Photos
  useEffect(() => {
    const fetchPhotos = async () => {
      setPhotosLoading(true);
      try {
        const photoData = await fetchModel(`/api/photo/photosOfUser/${userId}`);
        setPhotos(photoData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setPhotosLoading(false);
      }
    };
    fetchPhotos();
  }, [userId]);

  const handleCommentChange = (id, value) => {
    setCommentText((prev) => ({ ...prev, [id]: value }));
    setCommentError((prev) => ({ ...prev, [id]: "" }));
  };

  const handleAddComment = async (id) => {
    const comment = (commentText[id] || "").trim();
    if (!comment) {
      setCommentError((prev) => ({ ...prev, [id]: "Comment cannot be empty." }));
      return;
    }

    try {
      const res = await authFetch(`/api/photo/commentsOfPhoto/${id}`, {
        method: "POST",
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCommentError((prev) => ({ ...prev, [id]: data.error || "Error adding comment." }));
        return;
      }

      // Thêm comment mới vào state
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) => {
          if (String(photo._id) === String(id)) {
            return {
              ...photo,
              comments: [...(photo.comments || []), data],
            };
          }
          return photo;
        })
      );

      setCommentText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      setCommentError((prev) => ({ ...prev, [id]: "Network error." }));
    }
  };

  const handlePrev = () => {
    const currentIndex = photos.findIndex(p => String(p._id) === String(photoId));
    if (currentIndex > 0) {
      navigate(`/photos/${userId}/${photos[currentIndex - 1]._id}`);
    }
  };

  const handleNext = () => {
    let currentIndex = photos.findIndex(p => String(p._id) === String(photoId));
    if (currentIndex === -1) currentIndex = 0;
    if (currentIndex < photos.length - 1) {
      navigate(`/photos/${userId}/${photos[currentIndex + 1]._id}`);
    }
  };

  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  let displayedPhotos = photos;
  let currentIndex = 0;

  if (advancedFeatures && photos.length > 0) {
    if (photoId) {
      currentIndex = photos.findIndex((p) => String(p._id) === String(photoId));
      if (currentIndex === -1) currentIndex = 0;
    }
    displayedPhotos = [photos[currentIndex]];
  }

  return (
    <Box sx={{ p: 2 }}>
      {userLoading ? (
        <CircularProgress size={24} sx={{ mb: 2 }} />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Photos of {userName}
          </Typography>
          
          {advancedFeatures && photos.length > 0 && !photosLoading && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleNext} 
                disabled={currentIndex === photos.length - 1}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      )}

      {photosLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : photos.length === 0 ? (
        <Typography variant="body1">No photos found for this user.</Typography>
      ) : (
        displayedPhotos.map((photo) => (
          <Card key={photo._id} sx={{ mb: 4, boxShadow: 3 }} id={`photo-card-${photo._id}`}>
            <CardMedia
              component="img"
              image={`${BASE_URL}/images/${photo.file_name}`}
              alt={photo.file_name}
              sx={{ maxHeight: 400, objectFit: "contain", bgcolor: "#f5f5f5" }}
            />
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Uploaded: {formatDate(photo.date_time)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Comments */}
              {photo.comments && photo.comments.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Comments ({photo.comments.length})
                  </Typography>
                  {photo.comments.map((comment) => (
                    <Box
                      key={comment._id}
                      sx={{
                        mb: 2,
                        pl: 2,
                        borderLeft: "3px solid #1976d2",
                        bgcolor: "#f9f9f9",
                        borderRadius: 1,
                        py: 1,
                        pr: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        {comment.user ? (
                          <Link
                            component="button"
                            variant="subtitle2"
                            fontWeight="bold"
                            onClick={() => navigate(`/users/${comment.user._id}`)}
                            sx={{ textDecoration: "none", cursor: "pointer" }}
                          >
                            {comment.user.first_name} {comment.user.last_name}
                          </Link>
                        ) : (
                          <Typography variant="subtitle2" fontWeight="bold">
                            Unknown User
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          – {formatDate(comment.date_time)}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{comment.comment}</Typography>
                    </Box>
                  ))}
                </>
              )}

              {(!photo.comments || photo.comments.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No comments yet. Be the first!
                </Typography>
              )}

              {/* Add Comment Form */}
              <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "flex-start" }}>
                <TextField
                  id={`comment-input-${photo._id}`}
                  label="Add a comment..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  maxRows={3}
                  value={commentText[photo._id] || ""}
                  onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                  error={!!commentError[photo._id]}
                  helperText={commentError[photo._id]}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(photo._id);
                    }
                  }}
                />
                <Button
                  id={`comment-submit-${photo._id}`}
                  variant="contained"
                  size="small"
                  onClick={() => handleAddComment(photo._id)}
                  sx={{ minWidth: 80, mt: 0.5 }}
                >
                  Post
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserPhotos;
