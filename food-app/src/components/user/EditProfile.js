import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Avatar, Box, Typography, IconButton } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const userToken = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (userToken) {
        try {
            const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
            setUsername(decodedToken.currentUserName);
            setEmail(decodedToken.currentUserEmailId);
            setProfileImagePreview(`http://localhost:8080/profile-image/${decodedToken.currentUserImage}`);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
  }, [userToken]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 5MB. Please upload a smaller file.');
      return;
    }
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('emailId', email);
    if (profileImage) {
        formData.append('file', profileImage);
    }

    try {
        const response = await axios.post('http://localhost:8080/user-api/upload-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${userToken}`,
            },
        });
        
        setIsUpdated(true);
        setProfileImagePreview(response.data);
        alert("Profile uploaded successfully");
        navigate('/Home');
    } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);
        alert('Error updating profile. Please try again later.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 ,padding: 25.7}}>
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={profileImagePreview} alt={username} sx={{ width: 80, height: 80, mr: 2 }} />
          <label htmlFor="profile-image-upload">
            <input
              accept="image/*"
              id="profile-image-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <IconButton color="warning" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="warning"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </Box>
    </Box>
  );
}
