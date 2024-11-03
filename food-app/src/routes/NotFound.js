// import React from 'react';
// import { Container, Typography, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// function NotFound() {
//   const navigate = useNavigate();

//   return (
//     <Container sx={{margin:'263px'}}>
//       <Typography variant="h4" gutterBottom>
//         404 - Page Not Found
//       </Typography>
//       <Typography variant="body1" paragraph>
//         Sorry, the page you are looking for does not exist.
//       </Typography>
//       <Button variant="contained" color="warning" onClick={() => navigate('/home')}>
//         Go to Home
//       </Button>
//     </Container>
//   );
// };


// export default NotFound;

import React, { useContext } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { categoryContext } from '../App'; // Adjust the import path based on your file structure

function NotFound() {
  const navigate = useNavigate();
  const { isAdmin, isOwner,isLoggedIn } = useContext(categoryContext);

  // Define the function before using it
  const getRedirectionPath = () => {
    console.log('isAdmin:', isAdmin, 'isOwner:', isOwner,'isUser:',isLoggedIn);

    if (isAdmin) {
      console.log('Redirecting to Admin');
      return '/Admin-view';
    } 
    
    if (isOwner) {
      console.log('Redirecting to Owner');
      return '/Owner-view';
    }
  
   if(isLoggedIn){
    console.log('Redirecting to Home');
    return '/home';
   }
  };

  const getMessage = () => {
    if (isAdmin) {
      return 'Sorry, the page you are looking for does not exist. Please check the admin section.';
    } else if (isOwner) {
      return 'Sorry, the page you are looking for does not exist. Please check the owner section.';
    } else {
      return 'Sorry, the page you are looking for does not exist.';
    }
  };

  return (
    <Container sx={{ margin: '263px' }}>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1" paragraph>
        {getMessage()}
      </Typography>
      <Button variant="contained" color="warning" onClick={() => navigate(getRedirectionPath())}>
        Go to {isAdmin ? 'Admin' : isOwner ? 'Owner' : 'Home'}
      </Button>
    </Container>
  );
}

export default NotFound;
