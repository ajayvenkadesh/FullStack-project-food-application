import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Box,Grid,
  Typography,
  InputLabel,Select,MenuItem,FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function AddMenu() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  }=useForm({
     mode:"onBlur",
    reValidateMode:"onChange"
  });


    // State to store form data for all forms
  const [formsData, setFormsData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [selectedFiles, setSelectedFiles] = useState({});
  const [error,setError]=useState('');
  const [menuImgError,setMenuImgError] = useState('');
  const [menuResImgError,setResImgError] = useState('');
  const [restaurantImageFileName, setRestaurantImage] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState({});
  // const [resAdd,setresAdd]= useState(false);//for disabling card after register but didn't work out
  const [open, setOpen] = useState(false);  // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');  // Severity: 'success', 'error', 'warning', etc.
  const [currentOwnername,setCurrentOwnerName] = useState(null);

  const Ownertoken = localStorage.getItem("OwnerJwtToken"); 

  useEffect(() => {

    if(Ownertoken){
        try{
          const decodeOwnerToken = JSON.parse(atob(Ownertoken.split('.')[1]));
          console.log(decodeOwnerToken); 
    
          const userOwnerFromToken = decodeOwnerToken.currentRestaurantName;
          
          setCurrentOwnerName(userOwnerFromToken); 

        }
        catch(error){
            console.error("Error decoding token:", error);
        }

    }
  },[Ownertoken]);

  const navigate = useNavigate();

  //checking availabilty and making avlability count box hide if availablity is no
  const handleAvailabilityChange = (e, index) => {
    const value = e.target.value;
    setAvailabilityStatus((prevStatus) => ({
        ...prevStatus,
        [index]: value,
    }));
    };
  
    //handlinf menu item image change
   const handleFileChange = (event,index) => {
        const file = (event.target.files[0]);  // Get the selected file

        // If a file is selected
        if (file) {
          // Check if the file is an image
          if (file.type.startsWith('image/')) {
              // Store the selected file for the specific form index if it's an image
              setSelectedFiles((prevFiles) => ({
                  ...prevFiles,
                  [index]: file,
              }));
  
              // Clear the error for this specific index
              setMenuImgError((prevErrors) => ({
                  ...prevErrors,
                  [index]: '',  
              }));
          } else {
              // If it's not a valid image, set an error for this specific index
              setSelectedFiles((prevFiles) => ({
                  ...prevFiles,
                  [index]: null,  // Reset selected file for this index
              }));
              setMenuImgError((prevErrors) => ({
                  ...prevErrors,
                  [index]: 'Please upload a valid image file (jpg, png, etc.)',  // Set error for this specific index
              }));
          }
      } else {
          // No file was selected, just clear any selected file for this index
          setSelectedFiles((prevFiles) => ({
              ...prevFiles,
              [index]: null,
          }));
  
          // Do not show error unless an invalid file type is uploaded
          setMenuImgError((prevErrors) => ({
              ...prevErrors,
              [index]: 'Please upload a valid image',  // Clear error for this specific index if no file is selected
          }));
      }
    };

    //error snack bar
    const handleCloseerror = () => {
      setOpen(false);  // Close Snackbar
      
      // Redirect only if the snackbar message is related to a 500 error
      if (snackbarMessage.includes("Owner already exists.")) {
        navigate("/owner-view");  // Redirect to the homepage or any desired route
      }
    };

    //snackbar
    const handleClose = (reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbarOpen(false);
      //navigatation after successful registration worked fine
      navigate("/Owner-view");
    };

  // Function to handle adding a new form
  const handleAddForm = () => {
    setFormsData([
      ...formsData,
      {
        id: formsData.length + 1,
        itemName: '',
        description: '',
        itemCategory: '',
        itemType: '',
        price: '',
        availableCount: '',
        quantity: '',
      },
    ]);
  };

  // Function to handle removing a form
  const handleRemoveForm = (id) => {
    setFormsData(formsData.filter((form) => form.id !== id));
  };

   // Handle restaurant image upload next to Phone No field
   const handleRestaurantImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if the file is an image by checking the MIME type
      if (file.type.startsWith('image/')) {
          setRestaurantImage(file);  // Set the selected image file
          setResImgError('');  // Clear any previous error
      } else {
          setRestaurantImage(null);  // Reset selected file if it's not an image
          setResImgError('Please upload a valid image file (jpg, png, etc.)');  // Set error message
      }
  } else {
      setRestaurantImage(null);  // Reset selected file
      setResImgError('Please select an image file.');  // Set error message for no file selected
  }
  };


  //backend url
  const url = "http://localhost:8081/api/restaurants"


  //onsubmit
  const onSubmit=async(data,event)=>{

    console.log(data); // Handle form submission
    event.preventDefault();     

    //token getting and checking
    const OwnerJwtToken = localStorage.getItem('OwnerJwtToken');
    console.log("token received"+OwnerJwtToken);

    //no token throw error
    if(!OwnerJwtToken){
        console.error('JWT Token not found');
        return;
    }

    try {      

      const formData = new FormData();
  
      // Constructng the restaurant details object
      const restaurantDetails = {
        restaurantName: data.restaurantName,
        type: data.type,
        category: data.category,
        location: data.location,
        contactNumber: data.contactNumber,
      };
  
      // Append restaurant details as a JSON blob
      formData.append("restaurant", new Blob([JSON.stringify(restaurantDetails)], { type: "application/json" }));
  
      // Append restaurant image file if selected
      if (restaurantImageFileName) {
        formData.append("restaurantImage", restaurantImageFileName); // Fixed the field name
      }
  
      // Handle menu items
      const menuItems = formsData.map((form, index) => ({
        itemName: data[`itemName-${index}`],
        description: data[`description-${index}`],
        itemCategory: data[`itemCategory-${index}`],
        itemType: data[`itemType-${index}`],
        price: data[`price-${index}`],
        isAvailable: data[`isAvailable-${index}`],
        availableCount:data[`availableCount-${index}`]
      }));
  
      // Append the menu items as a JSON string
      formData.append("menuItems", new Blob([JSON.stringify(menuItems)], { type: "application/json" }));
  
      // Append the menu images
      Object.keys(selectedFiles).forEach((index) => {
        formData.append("menuImages", selectedFiles[index]);
      });

       // Send the request to backend
       const response = await axios.post(url+"/add", formData, {
        headers: {
          Authorization: `Bearer ${OwnerJwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      //checking response 
      console.log("Response:", response);
      alert("Restaurant added successfully!");
     
      // setresAdd(tr/ue);
      setSnackbarOpen(true);

    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          // If status is 400, show 'Owner already exists' error
          setSnackbarMessage("Owner already exists.");
         
          alert(error);
          setSnackbarSeverity("error");  // Set Snackbar to error
          setOpen(true);  // Open Snackbar
        } else if (error.response.status === 400) {
          // If status is 415, show 'Unsupported file type' error
          setSnackbarMessage("Please fill all the particulars mentioned");
          setSnackbarSeverity("error");
          alert(error);
          setOpen(true);  // Open Snackbar
        } else {
          // For other errors, show generic error message
          setSnackbarMessage("Something went wrong. Please check your connection and try again.");
          setSnackbarSeverity("error");
          alert(error);
          setOpen(true);  // Open Snackbar
        }
      }else{
      //error handling
      console.error(error);
      alert(error);
      setError("An error occurred while adding the restaurant.");
    }
  }
       
  }

  return (
    <Container maxWidth="xl" justifycontent="center"  
         alignitems="center" 
          sx={{ bgcolor: '#ffffff',  marginTop:'53px', marginBottom:'53px',borderRadius:'20px',boxShadow: 3}}
          >
        
          {/* Form Title */}
          <Box sx={{padding:'20px',bgcolor:'#ffffff',borderRadius:'20px 20px 0 0px'}}>

            {/* Head text */}
            <Typography  variant="h6" component="p"><b> New Menu </b>that's Exciting  Please Enter Details requested..</Typography>

            {/* hr style */}
            <hr style={{height:'3px', 
                width:'200px', 
                background:'linear-gradient(100deg, rgba(249,160,26,1) 0%, rgba(255,243,189,1) 100%',
                border:'none',
                borderRadius:'15px',
                marginLeft:'0px',}}

              />  
          </Box>    

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Form for restaurent */}
              <Box sx={{padding:2,marginTop:-3}}>
                
                <Grid container spacing={2} 
                    justifycontent="center"  // Centers horizontally
                    alignitems="center"  // Centers vertically if needed
                    mb={2}
                    >
                  
                    {/* restaurent name */}
                    <Grid item xs={4}>
                    <TextField
                        placeholder="Please enter Restaurant name"
                        fullWidth
                        value={currentOwnername || ""} // Auto-populate restaurant name from token
                        {...register("restaurantName", { required: "Restaurant name is required" })}
                        error={!!errors.restaurantName}
                        helperText={errors.restaurantName ? errors.restaurantName.message : ""}
                      />
                      
                    </Grid>  
                    
                    {/* type */}
                    <Grid item xs={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Type</InputLabel>
                        <Select {...register("type")} defaultValue="" label="Type">
                          <MenuItem value="VEG">Pure Veg</MenuItem>
                          <MenuItem value="NON_VEG">Non-Veg</MenuItem>
                          <MenuItem value="BOTH">Veg and Non veg</MenuItem>

                        </Select>
                      </FormControl>
                    </Grid>

                   
                    {/* category */}
                    <Grid item xs={4}>
                        <FormControl fullWidth required>
                          <InputLabel>Category</InputLabel>
                          <Select {...register("category")} defaultValue="" label="Category">
                            <MenuItem value="FAST_FOOD">Fast Food</MenuItem>
                            <MenuItem value="FINE_DINING">Fine Dining</MenuItem>
                            <MenuItem value="CASUAL_DINING">Casual Dining</MenuItem>
                            <MenuItem value="CAFE">Cafe</MenuItem>
                            <MenuItem value="OTHERS">Others</MenuItem>
                          </Select>
                        </FormControl>
                    </Grid>
                    

                </Grid>   

                <Grid container spacing={2} mb={3}>

                      {/* Address */}
                      <Grid item xs={4} >
                        <TextField fullWidth required
                            label="Address"                            
                            {...register("location",{required:"Address is required"})}
                             error={!!errors.location}
                              helperText={errors.location ? errors.location.message : ""}                          
                          />                        
                      </Grid>  

                      {/* Phone number */}
                      <Grid item xs={4}>
                        <TextField fullWidth  required
                            label="Phone No"                            
                            placeholder="please enter valid phone number"
                            {...register("contactNumber",
                              {required:"Please enter phone No",
                              pattern: {
                                  value: /^[6789]\d{9}$/,
                                  message: "Phone number must start with 6, 7, 8, or 9 and have 10 digits"
                              }}
                            )}
                            error={!!errors.contactNumber}
                          helperText={errors.contactNumber ? errors.contactNumber.message : ""}
                           
                          />                        
                      </Grid> 

                       {/* Upload Button for Restaurant Image */}
                        <Grid item xs={4}>
                          <Button variant="contained" component="label" color="warning" 
                          // accept="image/*"  // Restrict file input to only image types
                          >
                            Upload Restaurant Image
                            <input
                              type="file"
                              hidden                             
                              onChange={(e)=>handleRestaurantImageChange(e)} 
                              
                            />
                          </Button>
                          {restaurantImageFileName && !menuResImgError && (
                            <Typography variant="body1" sx={{ marginTop: 1 }}                            
                            >
                              Selected Image: {restaurantImageFileName.name}                              
                            </Typography>
                          )}
                           {menuResImgError && (
                            <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                              {menuResImgError}
                            </Typography>
                          )}
                        </Grid>
                </Grid>  
 
              </Box>
              
              {/* Menu form */}
              <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Menu Form
                </Typography>

                {/* Render each form dynamically */}          
                {formsData.map((form, index) => (
                  <Box key={form.id} sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
                    <Typography variant="h6" mb={1}>Menu {form.id}</Typography>

                      {/* Using Grid to display fields side by side */}
                    <Grid container spacing={2}> 
                        
                        {/* item name */}
                        <Grid item xs={2}>
                          <TextField  fullWidth required
                          label="Item Name" 
                          {...register(`itemName-${index}`,{required:"Item name is required"})} 
                          error={!!errors[`itemName-${index}`]}  
                          helperText={errors[`itemName-${index}`] ? errors[`itemName-${index}`].message : ""}
                          />
                        </Grid>

                        {/* description */}
                        <Grid item xs={2}>
                            <TextField  fullWidth required
                             label="Description"
                             {...register(`description-${index}`,{required:"Item Description is required"})} 
                             error={!!errors[`description-${index}`]}  // Dynamically access the error
                             helperText={errors[`description-${index}`] ? errors[`description-${index}`].message : ""}
                             />
                        </Grid>

                        {/* category */}
                        <Grid item xs={2}>
                          <FormControl fullWidth required>
                            <InputLabel>Item Category</InputLabel>
                            <Select {...register(`itemCategory-${index}`)} defaultValue="" label="Item Category">
                              <MenuItem value="MAIN_COURSE">Main Course</MenuItem>
                              <MenuItem value="DESSERT">Dessert</MenuItem>
                              <MenuItem value="STARTER">Starter</MenuItem>
                              <MenuItem value="BEVERAGE">Beverage</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* type of item */}
                        <Grid item xs={2}>
                          <FormControl fullWidth required>
                            <InputLabel>Item Type</InputLabel>
                            <Select {...register(`itemType-${index}`)} defaultValue="" label="Item Type">
                              <MenuItem value="VEG">Veg</MenuItem>
                              <MenuItem value="NON_VEG">Non-Veg</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Price */}
                        <Grid item xs={2}>
                        <TextField label="Price" fullWidth required
                          {...register(`price-${index}`,
                            {required:"Price is required",
                            pattern: {
                              value: /^[0-9]{1,3}$/,
                              message: "Price should be numeric with 1 to 3 digits"
                              }
                            })} 
                          error={!!errors[`price-${index}`]}  // Dynamically access the error
                          helperText={errors[`price-${index}`] ? errors[`price-${index}`].message : ""}                                              
                        />
                        </Grid>
                        
                        {/* available */}
                        <Grid item xs={2}>
                          <FormControl fullWidth>
                            <InputLabel >Available</InputLabel>
                            <Select {...register(`isAvailable-${index}`)} defaultValue="" 
                             label="Is Available"
                             onChange={(e) => handleAvailabilityChange(e, index)}>
                              <MenuItem value="True">Yes</MenuItem>
                              <MenuItem value="False">No</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>


                        {/* avaliablity based count getting */}
                        {availabilityStatus[index] === "True" && (
                        <Grid item xs={2}>
                        <TextField label="Available Count" fullWidth required
                        {...register(`availableCount-${index}`,{required:"Available count is required"})} 
                        error={!!errors[`availableCount-${index}`]}  // Dynamically access the error
                        helperText={errors[`availableCount-${index}`] ? errors[`availableCount-${index}`].message : ""}                                          
                        />
                        </Grid>)}

                          {/* File upload button */}
                        
                        <Grid item xs={3}>
                          <Button variant="contained" component="label" color="warning">
                            Upload Image
                            <input
                              type="file"
                              hidden
                              onChange={(e) => handleFileChange(e, index)}
                            />
                          </Button>

                          {/* Display selected file name */}
                          {selectedFiles[index] && !menuImgError[index] &&(
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                              Selected File: {selectedFiles[index].name}
                            </Typography>
                            
                          )}
                          {menuImgError[index] && (
                            <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                              {menuImgError[index]}
                            </Typography> 
                          )}
                        </Grid>
                        
                    </Grid>

                    {/* Remove Form button inside each form */}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveForm(form.id)}
                      sx={{ mt: 2 }}
                    >
                      Remove Form
                    </Button>
                  </Box>
                ))}


                {/* Add New Form link outside of each form container */}
                <Typography sx={{ mt: 2, mb: 4 }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleAddForm}
                    sx={{ cursor: "pointer" }}
                  >
                    Add Menu
                  </Link>
                </Typography>
              </Box>
                
              {/* This is button part */}
              <Grid container spacing={2} 
                    justifyContent="center"  // Centers horizontally
                    alignItems="center"  // Centers vertically if needed
                    mb={2}
                    >
                  <Grid item xs={12} >                
                      <Button type="submit" variant="contained" color="warning" size="large" sx={{borderRadius:5,backgroundColor:'#F9A01A',marginBottom:5}}
                      fullWidth
                        >Submit</Button>                  
                  </Grid> 

              </Grid>

              <Snackbar open={snackbarOpen} autoHideDuration={1000} onClose={handleClose} >
                      <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                      >
                       Restaurant added successfully
                      </Alert>
                </Snackbar>
                <Snackbar
                  open={open}
                  autoHideDuration={1000}
                  onClose={handleCloseerror}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Customize position
                >
                  <Alert onClose={handleCloseerror} severity={snackbarSeverity}>
                    {snackbarMessage}
                  </Alert>
                </Snackbar>

          </Box>
            
    </Container>
  );
};
{/*working fine*/}