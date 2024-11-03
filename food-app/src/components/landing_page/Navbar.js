
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem'; // Correct
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AdbIcon from '@mui/icons-material/Adb';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import ShoppingCartIcon
import Badge from '@mui/material/Badge'; // Import Badge
import { Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../add_cart/CartContext'; // Import useCart to access cart items
import { categoryContext } from '../../App';
import { useContext } from 'react';
import { useState,useEffect } from 'react';
import { useCallback } from 'react';

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const {handleAdminLogout,handleLogout,isLoggedIn,isAdmin,isOwner,
    handleOwnerLogin,
    handleOwnerLogout}= useContext(categoryContext);
  const [currentUsername,setCurrentUserName] = useState(null); 
  const [currentOwnername,setCurrentOwnerName] = useState(null);
  const[currentUserImageFileName,setUserImageFileName]=useState(null);
  const[currentRestaurantImageFileName,setRestaurantImageFileName]=useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

  const { cart } = useCart(); // Access cart items from CartContext
  const navigate = useNavigate();

  //userToken
  const userToken = localStorage.getItem("jwtToken");
  const Ownertoken = localStorage.getItem("OwnerJwtToken"); 


  useEffect(() => {

    if(userToken){
        try{
            const decodeuserToken = JSON.parse(atob(userToken.split('.')[1]));
            console.log(decodeuserToken); 

            const userNameFromToken = decodeuserToken.currentUserName;
            const userImageFileName =decodeuserToken.currentUserImage;                   
            setCurrentUserName(userNameFromToken); 
            setUserImageFileName(userImageFileName);

        }
        catch(error){
            console.error("Error decoding token:", error);
        }

    }
  },[userToken]);

  //owner name
  useEffect(() => {

    if(Ownertoken){
        try{
          const decodeOwnerToken = JSON.parse(atob(Ownertoken.split('.')[1]));
          console.log(decodeOwnerToken); 
    
          const userOwnerFromToken = decodeOwnerToken.currentOwnerName;
          
          setCurrentOwnerName(userOwnerFromToken); 

        }
        catch(error){
            console.error("Error decoding token:", error);
        }

    }
  },[Ownertoken]);
  
  const handleOwnerview = () => {
    if (isOwner) {
      handleOwnerLogout();
      navigate('/home');
    } else {
      navigate('/Owner-view');
    
    }
  };



  const handleLoginLogout = () => {
    if (isLoggedIn) {
      handleLogout();
      navigate('/home');
    } else {
      navigate('/login');
    
    }
  };

  const handleAdminView = () => {
    if (isAdmin) {
      handleAdminLogout();
      navigate('/home');
    } else {
      navigate('/Admin');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleAddMenu = () =>{
    navigate('/Addmenu')
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };   
    const handleEditProfile = () => {
    handleCloseUserMenu();
    navigate('/edit-profile');  // Navigate to the edit profile page
  };

  const updateUserImage = useCallback((newImageFileName) => {
    setUserImageFileName(newImageFileName);
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#F9A01A', boxShadow: 'none' }}>
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href='/home'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Foodiz
          </Typography>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Foodiz
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Stack spacing={2} direction="row" sx={{ float: 'right' }}>
          {/* <Button sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} variant="contained" component={Link} to="/Log">Test</Button> */}

          {!isOwner && !isAdmin && (
              <>
                <Button sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} variant="contained" component={Link} to="/Home">Home</Button>

                {!isLoggedIn && (
                  <Tooltip title="Add Restaurant">
                    <Button sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} variant="contained" onClick={handleOpenUserMenu}>Owner Registeration</Button>
                  </Tooltip>
                )}
                    
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* "New User" Option */}
              <MenuItem onClick={handleCloseUserMenu}>
                <Button sx={{ backgroundColor: '#F9A01A', boxShadow: 'none', fontWeight: 'bold' }} variant="contained" component={Link} to="/Owner-signup">New Owner</Button>
              </MenuItem>
              {/* "Existing User" Option */}
              <MenuItem onClick={handleCloseUserMenu}>
                <Button sx={{ backgroundColor: '#F9A01A', boxShadow: 'none', fontWeight: 'bold' }} variant="contained" component={Link} to="/Owner-login">Existing Owner</Button>
              </MenuItem>
            </Menu>

           
            
          
            {!isLoggedIn &&   (          
              <Button variant="contained" sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} onClick={handleSignup}>Sign Up</Button>
              
            )}
           
            <Button variant="contained" sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }}onClick={handleLoginLogout}>
              {isLoggedIn ? 'Logout' : 'Login'}
            </Button>

            

            </>
            )}  {/*keeping it til here to handle the button will explain in morning*/}
            
            {/* admin login logout handling */}
            {!isLoggedIn && !isOwner && (
            <Button variant="contained" sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} onClick={handleAdminView}>
              {isAdmin ? 'Admin Logout' : 'Admin'}
            </Button>          )}

            {/* Owner Logout button */}
            {isOwner && (
              <>

              {/* <Button  variant="contained"
                sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} onClick={handleAddMenu }>
               Add Menu</Button> */}
              
              <Button  variant="contained"
                sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }} component={Link} to="/Owner-view">
               Home</Button>
              

              <Button
                variant="contained"
                sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }}
                onClick={handleOwnerview}
              >
                Owner Logout
              </Button>

              </>
            )}

            {isLoggedIn &&   ( 
              <>
            <Button component={Link} to="/ordersummarytable" variant="contained"  sx={{ backgroundColor: 'transparent', boxShadow: 'none', fontWeight: 'bold' }}>
            Order summary
            </Button>

            <IconButton component={Link} to="/cart" sx={{ color: 'white' }}>
              <Badge badgeContent={cart?.length} color="error"> 
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Typography  sx={{ backgroundColor: 'transparent',  fontWeight: 'bold',padding:1.2,fontSize:14}}>
              Hi, {currentUsername.toUpperCase()}
            </Typography>
            
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile" onClick={handleEditProfile}>
                <IconButton  sx={{ p: 0 }}>
                  <Avatar alt={currentUsername.toUpperCase()} src={`http://localhost:8080/profile-image/${currentUserImageFileName}`}/>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* Edit Profile Option */}
                <MenuItem onClick={handleEditProfile}>
                  <Typography textAlign="center">Edit Profile</Typography>
                </MenuItem>
                {/* Add more options here if needed */}
              </Menu>
            
            </Box>


            </>
            )}

            {isOwner &&   ( 
              <>
            <Typography  sx={{ backgroundColor: 'transparent',  fontWeight: 'bold',padding:1.2,fontSize:14}}>
              Hi, {currentOwnername ? currentOwnername.toUpperCase() : ''}
            </Typography>
            
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <IconButton  sx={{ p: 0 }}>
                  <Avatar  alt={currentOwnername ? currentOwnername.toUpperCase() : ''} src={`http://localhost:8080/profile-image}`}/>
                </IconButton>
              </Tooltip>
            
            </Box>
           </>
            )}
          
          </Stack>
          
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}

