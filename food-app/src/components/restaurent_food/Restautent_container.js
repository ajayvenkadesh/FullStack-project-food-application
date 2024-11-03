import {
    CardContent,
   
    AppBar,Toolbar,Box,
    Container, 
    Grid
    } from '@mui/material';


import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
// import { useParams } from 'react-router-dom';
import Restaurant_Detail from './Restaurent_Detail';
import Restaurent_List from '../restaurent_food/Restaurent_List';
import { categoryContext } from '../../App';
import { useContext } from 'react';

export default function Restaurant_container({menu}){
    const {isLoggedIn} = useContext(categoryContext);

    console.log(menu)
    
    // const { id } = useParams();
    const location = useLocation();
    const { restaurent }  = location.state || {};  // Provide a fallback value
    
    console.log(location.state);  // Check if this shows as undefined
    console.log(restaurent);      // Should show the correct restaurant data    
    
    if (!restaurent) {
        return <h1>No Data Available</h1>;
    }

    return(
        <div>
            <Container maxWidth="xxl" disableGutters>
                <Box 
                sx={{
                height: '70vh', // Adjust the height as necessary
                backgroundImage: `url(http://localhost:8081/api/images/restaurant/${restaurent.restaurantEmailId}/${restaurent.restaurantImageFileName || 'defaultImage.jpg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
                }}
                
            >
                <Typography
                variant="h1"
                component="div"
                sx={{
                    color: 'white',                     
                    fontFamily:'cursize',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top:'35%',bottom:'50%',
                   
                    
                }}
                >
                {restaurent.name}
                <Typography sx={{
                     backgroundColor: 'rgba(0, 0, 0, 0.5)',
                     borderRadius: '8px',
                }}>

                </Typography>
                </Typography>
            </Box>

            {/* Restaurant Details */}
           <Restaurant_Detail restaurent={restaurent} loggedIn={isLoggedIn}/>
                    
            <AppBar position="static"sx={{backgroundColor:'#F9A01A',marginTop:2,marginBottom:2}}>
            <Container maxWidth="xl">
                 <Toolbar disableGutters>
                    <Typography noWrap variant="h5">List of Food Items Available</Typography>                    
                 </Toolbar>                 
            </Container>
            
            </AppBar>
            
            <Restaurent_List menu={menu} restaurent={restaurent}/>

            </Container>
      
        </div>
 
    );
}