import * as React from 'react';
import {
    Container,
    Box,    
    Typography,
    Link,
    List,
    Grid
    } from '@mui/material';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import HandshakeTwoToneIcon from '@mui/icons-material/HandshakeTwoTone';
import CleanHandsIcon from '@mui/icons-material/CleanHands';



export default function About(){
   
    return(
        <Box color={''}>
            <hr/>
            <Grid container sx={{backgroundColor:"#ffffff"}} padding={5} spacing={2} align={'center'} >
                <Grid item xs={4}>
                    <MenuBookIcon sx={{fontSize:60}}></MenuBookIcon>
                    <Typography variant='h6'>Variety of Menu</Typography>
                    <Typography margin={2}>Delight in a diverse range of dishes curated to satisfy every palate
                        and a menu packed with flavors</Typography>
                </Grid>
                <Grid item xs={4}>
                   
                    <CleanHandsIcon sx={{fontSize:60}}></CleanHandsIcon>
                     <Typography variant='h6'>Hygiene</Typography>
                    <Typography margin={2}>Maintaining the highest hygiene standards for your safety and peace of mind
                    Believe us your health is our priority—enjoy meals prepared with the utmost care.</Typography>
                    
                </Grid> 
                <Grid item xs={4}>
                   
                    <HandshakeTwoToneIcon sx={{fontSize:60}}></HandshakeTwoToneIcon>
                     <Typography variant='h6'>Trusted customers</Typography>
                    <Typography margin={2}>Proudly serving a loyal customer base that values quality and service and 
                    Thousands of happy customers can't be wrong—experience the trust we've earned</Typography>
                    
                </Grid> 
            </Grid>
        </Box>
        
    );
}
// your cravings we satisfy