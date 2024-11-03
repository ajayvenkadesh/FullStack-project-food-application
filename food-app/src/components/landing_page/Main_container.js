import{
Box,Container,Grid,
Typography,InputBase
} from "@mui/material";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";



export default function Main_container({ searchTerm, setSearchTerm, setFilterData,isLoggedIn, onLogout, isAdmin, onAdminLogout }){


    return(

        <Container maxWidth="xxl" disableGutters>
            <Box sx={{ textAlign: 'center' ,
                width: '100%',              // Fill the width of the container
                height: '60vh',            // Fill the entire viewport height
                backgroundImage: `url(${process.env.PUBLIC_URL}/images/foods.jpg)`,  // Set background image
                backgroundSize: 'cover',    // Ensure the image covers the entire area
                backgroundPosition: 'center', // Center the image
                backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                // paddingTop:"100px"
            }}>
            <Box align={'center'} 
                sx={{
                    color: "white",        // Text color
                    textAlign: "center",      // Center the text
                    zIndex: 1,                // Ensure text is above background
                    position: "absolute",     // Ensure it stays in the middle
                    top: "38%",               // Vertically center
                    left: "50%",              // Horizontally center
                    transform: "translate(-50%, -50%)"
                 }}>
                <Typography variant="h2" sx={{fontFamily:'cursize'}}>Welcome to Foodiz</Typography>
               
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} setFilterData={setFilterData}/>
            </Box>
            
            
            </Box>
        </Container>
    );
}