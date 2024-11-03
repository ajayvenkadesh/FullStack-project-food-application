// import { Link, useNavigate } from "react-router-dom";




// import {
//   Container,Grid2,
//   Typography,Card,
//   CardMedia,
//   CardContent,
//   CardActions
  
 
// } from "@mui/material";

// export default function Owner_view(){
//     const navigate = useNavigate();



//     const handleclick=()=>{
//         navigate('/addMenu');
//     }

//     const handlemenuclick=()=>{
//         navigate('/owner_menuView')
//     }

//     const handleOrderClick=()=>{
//         navigate('/owner_orderView')
//     }

//     return(     
//          <Container maxWidth="xxl"  >
//             <Grid2 container padding={13.0} 
//                 spacing={2}  // Centers horizontally
//                   // Centers vertically if needed
//                 align={'center'}
//                 sx={{justifyContent:"center" ,alignItems:"center"}}
//              >    
//                 <Grid2 item xs={6} sx={{maxWidth: 545}} align={'center'}>                     
//                     <Card sx={{bgcolor: '#ffffff',  marginTop:'53px', marginBottom:'53px',boxShadow: 3}}>
//                         <CardMedia
//                          sx={{ height: 250 }}
//                          component="img"
//                          image="/Image20241014090249.png" alt="not found"
//                          onClick={handleclick}>

//                         </CardMedia>
//                         <CardContent>
//                             <Typography variant="h4" sx={{fontFamily:'curzive'}}> Add restaurant</Typography>
//                         </CardContent>
//                     </Card>
//                 </Grid2>    
//                 <Grid2> 
//                     <Grid2 item xs={6} sx={{maxWidth: 545}}> 
//                         <Card sx={{bgcolor: '#ffffff',  marginTop:'53px', marginBottom:'53px',boxShadow: 3}}>
//                             <CardMedia
//                             sx={{ height: 250 }}
//                             component="img"
//                             image="/Image20241014090246.png" alt="not found"
//                             onClick={handlemenuclick}>
//                             </CardMedia>
//                             <CardContent>
//                                 <Typography variant="h4" sx={{fontFamily:'curzive'}}>View Menu</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid2>  
//                 </Grid2>      
//                 <Grid2> 
//                     <Grid2 item xs={6} sx={{maxWidth: 545}}> 
//                         <Card sx={{bgcolor: '#ffffff',  marginTop:'53px', marginBottom:'53px',boxShadow: 3}}>
//                             <CardMedia
//                             sx={{ height: 250 }}
//                             component="img"
//                             image="/Image20241016081458.png" alt="not found"
//                             onClick={handleOrderClick}>
//                             </CardMedia>
//                             <CardContent>
//                                 <Typography variant="h4" sx={{fontFamily:'curzive'}}> View orders</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid2>  
//                 </Grid2>      
//             </Grid2>
//         </Container>
   
//     );
// }

import { Link, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from 'axios';
import {
  Container,Grid2,
  Typography,Card,
  CardMedia,
  CardContent,
} from "@mui/material";

export default function Owner_view(){

    const [ownerMenuItems, setOwnerMenuItems] = useState([]);

    const [currentHotelname,setCurrentHotelName] = useState(null);
    const [currentRestaurantEmailId, setCurrentRestaurantEmailId] = useState('');
    
    const navigate = useNavigate();

    const handleclick=()=>{
        navigate('/addMenu');
    }

    const handlemenuclick=()=>{
        navigate('/owner_menuView')
    }

    const handleOrderClick=()=>{
        navigate('/owner_orderView')
    }

    

    //owner token
    const OwnerJwtToken = localStorage.getItem("OwnerJwtToken"); 

    //ower name
    useEffect(() => {
    if(OwnerJwtToken){
        try{
            const decodeuserToken = JSON.parse(atob(OwnerJwtToken.split('.')[1]));
            console.log(decodeuserToken); 

            const ownerNameFromToken = decodeuserToken.currentRestaurentName; 
            setCurrentHotelName(ownerNameFromToken); 

        }
        catch(error){
            console.error("Error decoding token:", error);
        }

     }},[OwnerJwtToken]);

        // Exsisting owner check
        useEffect(() => {
            // Retrieve token from localStorage
           
           if (OwnerJwtToken) {
             try {
               // Decode the JWT token to extract restaurant email ID
               const decodedJwt = JSON.parse(atob(OwnerJwtToken.split('.')[1]));
               const ownerEmailFromToken = decodedJwt.currentRestaurantEmailId;
               setCurrentRestaurantEmailId(ownerEmailFromToken);
       
               // Fetch approved restaurants using the token
               axios.get("http://localhost:8081/api/restaurants/approved", {
                 headers: {
                   Authorization: `Bearer ${OwnerJwtToken}`, // Send token in Authorization header
                 },
               })
               .then((response) => {
                 const data = response.data;
                 if (Array.isArray(data) && data.length > 0) {
                   setOwnerMenuItems(data); // Store all restaurant data
                 } else {
                   console.error("No restaurants found");
                 }
               })
               .catch((error) => {
                 console.error("Error fetching data:", error);
               });
             } catch (error) {
               console.error("Error decoding token:", error);
             }
           }
         }, [OwnerJwtToken]);

        //  Filter the menu items that belong to the current restaurant
    const filteredMenuItems = ownerMenuItems.filter(
        (menu) => menu.restaurantEmailId === currentRestaurantEmailId
    );

    return(     
         <Container maxWidth="xxl"  >
             <Typography align="center" variant="h3" sx={{fontFamily:'curzive',padding:9}}>{currentHotelname}</Typography>
             <Grid2 container paddingBottom={14.5}
                spacing={2}                 
                align={'center'}
                sx={{justifyContent:"center" ,alignItems:"center"}}
             >    
                {/* Conditionally render the "Add Restaurant" card if no restaurant is approved  */}
                {filteredMenuItems.length == 0 ? (
                <Grid2 item xs={6} sx={{maxWidth: 545}} align={'center'}>                     
                    <Card sx={{bgcolor: '#ffffff',boxShadow: 3}}>
                        <CardMedia
                         sx={{ height: 250 }}
                         component="img"
                         image="/Image20241014090249.png" alt="not found"
                         onClick={handleclick}>

                        </CardMedia>
                        <CardContent>
                            <Typography variant="h4" sx={{fontFamily:'curzive'}}> Add restaurant</Typography>
                        </CardContent>
                    </Card>
                </Grid2> 
                ):(
                     console.log("data present")
                 )}   

                {/* // if RestaurantApproved  */}
                {filteredMenuItems.length > 0 ?  (
                    <>
                        <Grid2> 
                            <Grid2 item xs={6} sx={{maxWidth: 545}}> 
                                <Card sx={{bgcolor: '#ffffff',boxShadow: 3}}>
                                    <CardMedia
                                    sx={{ height: 250 }}
                                    component="img"
                                    image="/Image20241014090246.png" alt="not found"
                                    onClick={handlemenuclick}>
                                    </CardMedia>
                                    <CardContent>
                                        <Typography variant="h4" sx={{fontFamily:'curzive'}}>View Menu</Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>  
                        </Grid2>      
                        <Grid2> 
                            <Grid2 item xs={6} sx={{maxWidth: 545}}> 
                                <Card sx={{bgcolor: '#ffffff',boxShadow: 3}}>
                                    <CardMedia
                                    sx={{ height: 250 }}
                                    component="img"
                                    image="/Image20241016081458.png" alt="not found"
                                    onClick={handleOrderClick}>
                                    </CardMedia>
                                    <CardContent>
                                        <Typography variant="h4" sx={{fontFamily:'curzive'}}> View orders</Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>  
                        </Grid2>   
                    </>                            
                    ):(
                        console.log("sorry2")
                    )}
            </Grid2>
        </Container>
   
    );
}


