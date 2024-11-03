
import { useForm } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  AppBar,TextField,
  InputLabel,Select,MenuItem,FormControl,
  Toolbar,
  Typography,Snackbar,Alert,
  Button,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress, Switch
} from "@mui/material";
import axios from "axios";

export default function View_menus() {

 const [formsData, setFormsData] = useState([]);
 const [view, setView] = useState("menulist");
 const [ownerMenuItems, setOwnerMenuItems] = useState([]);
 const [currentEmailId, setCurrentRestaurantEmailId] = useState(null);

 //for forms
 const [selectedFiles, setSelectedFiles] = useState({});
 const [menuImgError,setMenuImgError] = useState('');
 const [availabilityStatus, setAvailabilityStatus] = useState({});
 const [open, setOpen] = useState(false);  // Snackbar visibility
 const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message
 const [snackbarSeverity, setSnackbarSeverity] = useState('success');  // Severity: 'success', 'error', 'warning', etc.
 const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
 const [error,setError]=useState('');

 const navigate = useNavigate();


 const {
    register,
    handleSubmit,
    formState: { errors },
  }=useForm({
     mode:"onBlur",
    reValidateMode:"onChange"
  });

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

  //snackbar
  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    //navigatation after successful registration worked fine
    navigate("/Owner-view");
  };

  //fetch data
  useEffect(() => {

    // Retrieve token from localStorage
    const OwnerJwtToken = localStorage.getItem("OwnerJwtToken"); 
    // alert(localStorage.getItem('OwnerJwtToken'));

    //decoding jwt
    const decodedJwt = JSON.parse(atob(OwnerJwtToken.split('.')[1]));
    console.log(decodedJwt); 
    // alert( JSON.stringify(decodedJwt));

    if(decodedJwt){
        const ownerEmailFromToken = decodedJwt.currentRestaurantEmailId; // Assuming the token has a field 'restaurantEmailId'
        setCurrentRestaurantEmailId(ownerEmailFromToken); 
   
        
        axios.get("http://localhost:8081/api/restaurants/approved",
         {
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
    }
  }, []);

  //remove if logic is ok , just for checking
  const checkEmailMatch = () => {
    return ownerMenuItems.some(menu => menu.restaurantEmailId === currentEmailId);
  };


  // Filter the menu items that belong to the current restaurant
  const filteredMenuItems = ownerMenuItems.filter(
    (menu) => menu.restaurantEmailId === currentEmailId
  );

  //logic for form the data 
  
  //backend url
  const url = `http://localhost:8081/api/restaurants/add-menu`

  
  //onsubmit
  const onSubmit=async(data,event)=>{

    console.log(data); // Handle form submission
    event.preventDefault();     

    //token getting and checking
    const OwnerJwtToken = localStorage.getItem('OwnerJwtToken');
    

    const decodedJwt = JSON.parse(atob(OwnerJwtToken.split('.')[1]));
    console.log(decodedJwt); 

    //no token throw error
    if(!OwnerJwtToken){
        console.error('JWT Token not found');
        return;
    }

    if(decodedJwt){
        const ownerEmailFromToken = decodedJwt.currentRestaurantEmailId; // Assuming the token has a field 'restaurantEmailId'
        setCurrentRestaurantEmailId(ownerEmailFromToken); 
    try {      

      const formData = new FormData();
  
      // Handle menu items
      const menuItem = formsData.map((form, index) => ({
        itemName: data[`itemName-${index}`],
        description: data[`description-${index}`],
        itemCategory: data[`itemCategory-${index}`],
        itemType: data[`itemType-${index}`],
        price: data[`price-${index}`],
        isAvailable: data[`isAvailable-${index}`],
        availableCount:data[`availableCount-${index}`]
      }));
  
      // Append the menu items as a JSON string
      formData.append("menuItem", new Blob([JSON.stringify(menuItem)], { type: "application/json" }));
  
      // Append the menu images
      Object.keys(selectedFiles).forEach((index) => {
        formData.append("menuImage", selectedFiles[index]);
      });

      

       // Send the request to backend
       const response = await axios.post(url+`/${currentEmailId}`, formData, {
        // method: 'POST', 
        headers: {
          Authorization: `Bearer ${OwnerJwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      //checking response 
      console.log("Response:", response);
      alert("Menu added successfully!");
     
      // setresAdd(tr/ue);
      setSnackbarOpen(true);
    
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          // If status is 400, show 'Owner already exists' error
          setSnackbarMessage("Wait for approval already exists.");
         
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
      setError("An error occurred while adding the new menu.");
    }
  }
}    
  }

  const [editItemId, setEditItemId] = useState(null); // Track the item being edited
  const [editedData, setEditedData] = useState({ availableCount: '', isAvailable: false });
  const [isAvailable, setIsAvailable] = useState(true);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Snackbar close handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Validation check before form submission
  const handleSubmitFor = () => {
    if (!isAvailable && availableQuantity !== 0) {
      // Show snackbar if isAvailable is "No" but quantity is not 0
      setOpenSnackbar(true);
      return;
    }

    // Proceed with the update (send request to the backend)
    console.log("Updating data: ", { isAvailable, availableQuantity });
  };

      // Function to handle update click
      const handleUpdateClick = (item) => {
        setEditItemId(item.itemId); // Set the item to be edited
        setEditedData({
            itemId: item.itemId, // Store itemId in state
            availableCount: item.availableCount,
            isAvailable: item.isAvailable
        });
    };

    const[menuList,setMenuList]=useState([])

    // Function to handle save click (add API call here)
    const handleSaveClick = async (item) => {
      const updatedItem = {
          itemId: editedData.itemId,
          availableCount: editedData.availableCount,
          isAvailable: editedData.isAvailable,
      };
    
      try {
          const token = localStorage.getItem('OwnerJwtToken'); // Get the token from storage
    
          const response = await fetch(`http://localhost:8081/api/restaurants/update-menu/${currentEmailId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,  // Add the token in the Authorization header
              },
              body: JSON.stringify(updatedItem),
          });
    
          if (response.ok) {
              const updatedMenuList = menuList.map(menu => {
                  // Find the specific restaurant by `restaurantEmailId`
                  if (menu.restaurantEmailId === currentEmailId) {
                      const updatedMenu = menu.restaurantMenuList.map(menuItem => {
                          // Update the specific menu item by `itemId`
                          if (menuItem.itemId === updatedItem.itemId) {
                              return { ...menuItem, ...updatedItem };
                          }
                          return menuItem;
                      });
    
                      // Return the updated restaurant with the modified menu
                      return { ...menu, restaurantMenuList: updatedMenu };
                  }
                  return menu;
              });
    
              // Update the state with the modified menu list
              setMenuList(updatedMenuList);
    
              console.log("Update successful", updatedItem);
              setEditItemId(null);  // Close the editing view
          } else {
              console.error("Error updating item");
          }
      } catch (error) {
          console.error("Failed to update item", error);
      }
    };
    

  return (
        <div>

            <Typography variant="h5" sx={{ flexGrow: 1,fontFamily:'curzive',margin:3,boxShadow:2,padding:1,paddingLeft:2,borderRadius:3,backgroundColor:'#F9A01A',color:"white" }}>
               Welcome <b>Owner</b> to your Dashboard
            </Typography>

            {/* Buttons to toggle views */}
            <Box p={2} textAlign="center">
                <Button
                variant={view === "menulist" ? "contained" : "outlined"}
                onClick={() => setView("menulist")}
                sx={{
                    m: 1,                    
                    backgroundColor: view === "menulist" ? "orange" : "white",
                    color: view === "menulist" ? "white" : "black",
                    fontWeight: view === "menulist" ? "bold" : "normal",
                    borderColor: "orange",
                    "&:hover": {
                    backgroundColor: view === "menulist" ? "darkorange" : "lightgray",
                    },
                }}
                >
                List of Menu
                </Button>
                <Button
                variant={view === "menu" ? "contained" : "outlined"}
                onClick={() => setView("menu")}
                sx={{
                    m: 1,
                    backgroundColor: view === "menu" ? "orange" : "white",
                    color: view === "menu" ? "white" : "black",
                    fontWeight: view === "menu" ? "bold" : "normal",                    
                    borderColor: "orange",
                    "&:hover": {
                    backgroundColor: view === "menu" ? "darkorange" : "lightgray",
                    },
                }}
                >
                Add Menu
                </Button>
               
            </Box>

            {/* Main Content */}
            <Box p={3}>
                <Grid container spacing={3}>
                    {view === "menulist" && (
                    <Grid item xs={12}>
                        {/* Conditionally render the table only if there are matching menu items */}
                        {filteredMenuItems.length > 0 ? (
                    <TableContainer sx={{ boxShadow: 5 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Item Image</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Item Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Restaurant Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Item Price with GST</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Item Type</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Item Category</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Is Available</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Available Count</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "Bold" }}>Update</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMenuItems.map((menu) =>
                                    menu.restaurantMenuList.map((item) => (
                                        <TableRow key={item.itemId}>
                                            <TableCell align="center">
                                                <img
                                                    src={`http://localhost:8081/api/images/menu/${menu.restaurantEmailId}/${item.menuImageFileName}`}
                                                    alt={item.itemName}
                                                    style={{ width: "100px", height: "100px", borderRadius: 10 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">{item.itemName}</TableCell>
                                            <TableCell align="center">{menu.restaurantName}</TableCell>
                                            <TableCell align="center">₹{item.price + 60}</TableCell>
                                            <TableCell align="center">{item.itemType}</TableCell>
                                            <TableCell align="center">{item.itemCategory}</TableCell>

                                            {/* Conditional rendering for isAvailable and availableCount */}
                                            <TableCell align="center">
                                                {editItemId === item.itemId ? (
                                                    <Switch
                                                        checked={editedData.isAvailable}
                                                        onChange={(e) => setEditedData({ ...editedData, isAvailable: e.target.checked })}
                                                    />
                                                ) : (
                                                    item.isAvailable ? "Yes" : "No"
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {editItemId === item.itemId ? (
                                                    <TextField
                                                        type="number"
                                                        value={editedData.availableCount}
                                                        onChange={(e) => setEditedData({ ...editedData, availableCount: e.target.value })}
                                                        size="small"
                                                    />
                                                ) : (
                                                    item.availableCount
                                                )}
                                            </TableCell>

                                            <TableCell align="center">
                                                {editItemId === item.itemId ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleSaveClick(item)}
                                                    >
                                                        Save
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleUpdateClick(item)}
                                                    >
                                                        Update
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography align="center">
                        Waiting for approval from Admin... Please wait till approval request is accepted.
                    </Typography>
                )}
                       
                    </Grid>
                    )}
                    
                    {view === "menu" && (
                    <Grid item xs={12} component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ p: 2 }} >
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
                            Menu added successfully
                            </Alert>
                        </Snackbar>

                       
                    </Grid>
                    )}
                </Grid>
            </Box>
        </div>
  );
}
