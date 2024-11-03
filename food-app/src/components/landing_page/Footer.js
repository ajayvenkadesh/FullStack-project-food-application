import * as React from 'react';
import {
    Container,
    Box,    
    Typography,
    Link,
    List,
    Grid
    } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';


export default function Footer(){
   
    return(
        <Box color={'#ffffff'} >
            <hr/>
            <Grid container sx={{backgroundColor:"#F9A01A"}} padding={5} spacing={2} align={'center'} >
                <Grid item xs={4}>
                  <Link href="link"  sx={{ textDecoration: 'none',color: 'inherit'}} >    
                    <Typography variant='h6'spacing={2} >About Us</Typography>
                   </Link>
                   <Link href="link"  sx={{ textDecoration: 'none',color: 'inherit'}} >
                        <Typography marginTop={1}   >Contact Us</Typography>
                    </Link>
                    <Link href="link"  sx={{ textDecoration: 'none',color: 'inherit'}} >
                        <Typography marginRight={2} >About Us</Typography>
                    </Link>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='h6'>For Restaurent</Typography>
                    <Link href="link"  sx={{ textDecoration: 'none',color: 'inherit'}} >
                            <Typography marginTop={1}>Connect with Us</Typography>
                    </Link>
                    
                </Grid> 
                <Grid item xs={4}>
                <Typography variant='h6' >Social Links</Typography>
                <List >
                    <Link href="https://facebook.com" color="#ffffff" >
                         <FacebookIcon  sx={{fontSize:32,marginRight:1}}/>
                    </Link>
                    <Link href="https://x.com" color="#ffffff">
                         <XIcon sx={{fontSize:28,marginRight:1}} />
                    </Link>
                    <Link href="https://instagram.com"  color="#ffffff">
                         <InstagramIcon  sx={{fontSize:29, marginTop:1}}/>
                    </Link>
                </List>
                </Grid>
            </Grid>
        </Box>
        
    );
}