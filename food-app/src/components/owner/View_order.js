import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {

  Typography,
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
  Grid2,
  
} from "@mui/material";
import axios from "axios";

export default function View_order() {
  const [view, setView] = useState("orders");
  const [orderItems, setOrderItems] = useState([]);
  const [currentEmailId, setCurrentRestaurantEmailId] = useState(null);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const navigate = useNavigate();
  

  //fetch data
  useEffect(() => {

    // Retrieve token from localStorage
    const OwnerJwtToken = localStorage.getItem("OwnerJwtToken");   
        
        axios.get("http://localhost:8081/api/orders/restaurant/pending",
         {
            headers: {
            Authorization: `Bearer ${OwnerJwtToken}`, // Send token in Authorization header
            },
        })

      .then((response) => {
        
        const data = response.data;
        
        if (Array.isArray(data) && data.length > 0) {
            setApprovalRequests(data); // Store all restaurant data
        } else {
          alert("No Orders found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    
  }, []);


  //approved-orders
  useEffect(() => {
    // Retrieve token from localStorage
    const OwnerJwtToken = localStorage.getItem("OwnerJwtToken");
    
    if (OwnerJwtToken) {
      // Decoding the JWT token to get the restaurant email ID
      const decodedJwt = JSON.parse(atob(OwnerJwtToken.split('.')[1]));
      console.log(decodedJwt);
  
      // Assuming the token contains the restaurantEmailId
      const ownerEmailFromToken = decodedJwt.currentRestaurantEmailId;
      setCurrentRestaurantEmailId(ownerEmailFromToken);
  
      if (ownerEmailFromToken) {
        // Making the GET request with token in Authorization header
        axios
          .get(`http://localhost:8081/api/orders/restaurant/approved-orders/${ownerEmailFromToken}`, {
            headers: {
              Authorization: `Bearer ${OwnerJwtToken}`, // Send the token in Authorization header
            },
          })
          .then((response) => {
            const data = response.data;
            if (Array.isArray(data) && data.length > 0) {
              setOrderItems(data); // Store approved orders data
            } else {
              console.error("No orders found");
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    } else {
      console.error("OwnerJwtToken not found in localStorage");
    }
  }, [currentEmailId]);
  
  //logic deny
   
  // Function to handle approval or denial of a restaurant
  const handleApprovalChange = (orderId, status) => {
    const Ownertoken = localStorage.getItem("OwnerJwtToken"); // Retrieve token from localStorage

    if (orderId && Ownertoken) {
      axios
        .put(
          `http://localhost:8081/api/orders/restaurant/${status === "approved" ? "approve" : "deny"}/${orderId}`,
          { approvalStatus: status }, // Pass the status to the API
          {
            headers: {
              Authorization: `Bearer ${Ownertoken}`, // Send token in Authorization header
            },
          }
        )
        .then((response) => {
          if (status === "approved") {
            const updatedRequests = approvalRequests.filter(
              (order) => order.orderId !== orderId
            );
            setApprovalRequests(updatedRequests);
            setOrderItems((prevRestaurants) => [
              ...prevRestaurants,
              response.data, // Assuming the response contains the updated restaurant data
            ]);
          } else {
            const updatedRequests = approvalRequests.filter(
              (order) => order.orderId !== orderId
            );
            setApprovalRequests(updatedRequests);
          }
        })
        .catch((error) => {
          console.error("Error updating approval status:", error);
        });
    } else {
      console.error("Invalid orderId or missing token");
    }
  };
  
  //navigate back
  const goBack = () => {
    navigate('/owner-view'); // This will navigate to the previous page
  };

  return (
        <div>
 
            <Grid2 container variant="h5" sx={{ fontFamily:'curzive',margin:3,boxShadow:2,padding:1,paddingLeft:2,borderRadius:3,backgroundColor:'#F9A01A',color:"white",display: 'flex', justifyContent: 'space-between', alignItems: 'center'   }}>
               
                  <Grid2 item xs={8}>
                      <Typography variant="h5" sx={{fontFamily:'curzive'}}>Welcome <b>Owner</b> to your Dashboard</Typography>
                  </Grid2>

                  <Grid2 item xs={3} sx={{ float: 'right'}}>
                      <Button color="white" onClick={goBack} sx={{fontWeight:'bold'}}>Back to Home</Button>
                  </Grid2>
               
            </Grid2>

            <Typography
            variant="h5"
            sx={{
                color: 'red',
                textAlign: 'center',
                fontFamily:"curzive",
                margin: 2,
            }}
        >
            Pending Order : {approvalRequests.length}
        </Typography>

            {/* Buttons to toggle views */}
            <Box p={2} textAlign="center">

                <Button                
                variant={view === "approved" ? "contained" : "outlined"}
                onClick={() => setView("approved")}
                sx={{
                    m: 1,                    
                    backgroundColor: view === "approved" ? "orange" : "white",
                    color: view === "approved" ? "white" : "black",
                    fontWeight: view === "approved" ? "bold" : "normal",
                    borderColor: "orange",
                    "&:hover": {
                    backgroundColor: view === "approved" ? "darkorange" : "lightgray",
                    },
                }}
                >
                completed order
                </Button>

                <Button
                variant={view === "orders" ? "contained" : "outlined"}
                onClick={() => setView("orders")}
                sx={{
                    m: 1,
                    backgroundColor: view === "orders" ? "orange" : "white",
                    color: view === "orders" ? "white" : "black",
                    fontWeight: view === "orders" ? "bold" : "normal",                    
                    borderColor: "orange",
                    "&:hover": {
                    backgroundColor: view === "orders" ? "darkorange" : "lightgray",
                    },
                }}
                >
                pending order approvals 
                </Button>
               
            </Box>

            {/* Main Content */}
            <Box p={3}>
                <Grid container spacing={3}>
                    {view === "approved" && (
                    <Grid item xs={12}>
                        {/* List of Restaurants */}
                        {orderItems.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>                                            
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Item Image</TableCell>
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Item Name</TableCell>
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>User Email</TableCell>    
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Phone</TableCell>    
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Address</TableCell>    
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>City</TableCell>
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Zip</TableCell>                 
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Land Mark</TableCell>
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Quantity</TableCell>  
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}> Total Amount</TableCell>
                                            <TableCell align="center" sx={{fontWeight:'Bold'}}>Status</TableCell>
                                                                                     
                                                                                       
                                                                                                                                    
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {orderItems   
                                        .filter(order => order.restaurantEmailId === currentEmailId)                                     
                                        .map((order) =>
                                            order.orderedItems                                           
                                            .map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell align="center">
                                                <img
                                                    src={`http://localhost:8081/api/images/menu/${order.restaurantEmailId}/${item.menuImageFileName}`}
                                                    alt={order.itemName}
                                                    style={{ width: "100px", height: "100px",borderRadius:10 }}
                                                />
                                                </TableCell>
                                                <TableCell align="center">{item.itemName}</TableCell>
                                                <TableCell align="center">{order.userEmailId}</TableCell>
                                                <TableCell align="center">{order.phone}</TableCell>
                                                <TableCell align="center">{order.address}</TableCell>
                                                <TableCell align="center">{order.city}</TableCell>
                                                <TableCell align="center">{order.zip}</TableCell>
                                                <TableCell align="center">{order.landMark}</TableCell>
                                                <TableCell align="center">{item.quantity}</TableCell>                                                                                                                                       
                                                <TableCell align="center">₹{order.totalAmount+60} </TableCell> 
                                                
                                                {/* <TableCell align="center">{item.isAvailable? "Yes" : "No"} </TableCell> 
                                                <TableCell align="center">{item.availableCount} </TableCell>  */}
                                                <TableCell align="center">{order.status} </TableCell> 

                                               
                                            </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                             ) : (
                                <Typography align="center">No Approved orders available</Typography>
                            )}
                             
                    </Grid>
                     )}

                </Grid>


                  {view === "orders" && (
                    <Grid item xs={12}> 
                        {/* List of Pending Approvals */}
                         { approvalRequests.length > 0 ? (
                         <TableContainer component={Paper}>
                         <Table>
                             <TableHead>
                                 <TableRow >                                            
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Item Image</TableCell>
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Item Name</TableCell>
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>User Email</TableCell>    
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Phone</TableCell>    
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Address</TableCell>    
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>City</TableCell>
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Zip</TableCell>                 
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Land Mark</TableCell>
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Ordered Quantity</TableCell>
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}> Total Amount</TableCell>
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Is Available</TableCell>
                                     {/* <TableCell align="center" sx={{fontWeight:'Bold'}}>Available Count</TableCell>                                            */}
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Status</TableCell>                                           
                                     <TableCell align="center" sx={{fontWeight:'Bold'}}>Action</TableCell>                                           
                                                                                                                                 
                                 </TableRow>
                             </TableHead>
                             <TableBody>
                                {approvalRequests
                                    .filter(order => order.restaurantEmailId === currentEmailId)
                                    .map((order) => (
                                        <React.Fragment key={order.orderId}>
                                            {order.orderedItems.map((item, index) => (
                                                <TableRow key={item._id}>
                                                    {/* {index === 0 && ( // Only render this cell once per order */}
                                                        <TableCell >
                                                            <img
                                                                src={`http://localhost:8081/api/images/menu/${order.restaurantEmailId}/${item.menuImageFileName}`}
                                                                alt={item.itemName}
                                                                style={{ width: "100px", height: "100px", borderRadius: 10 }}
                                                            />
                                                        </TableCell>
                                                    {/* )} */}
                                                    <TableCell align="center">{item.itemName}</TableCell>
                                                    <TableCell align="center">{order.userEmailId}</TableCell>
                                                    <TableCell align="center">{order.phone}</TableCell>
                                                    <TableCell align="center">{order.address}</TableCell>
                                                    <TableCell align="center">{order.city}</TableCell>
                                                    <TableCell align="center">{order.zip}</TableCell>
                                                    <TableCell align="center">{order.landMark}</TableCell>
                                                    <TableCell align="center">{item.quantity}</TableCell>
                                                    <TableCell align="center">₹{order.totalAmount + 60}</TableCell>
                                                    <TableCell align="center">{item.isAvailable ? "Yes" : "No"}</TableCell>
                                                    <TableCell align="center">{order.status}</TableCell>

                                                    {index === 0 && ( // Render action buttons only once for each order
                                                        <TableCell align="center" rowSpan={order.orderedItems.length}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                onClick={() => handleApprovalChange(order.orderId, "approved")}
                                                                sx={{
                                                                    m: 0.5, fontWeight: 'bold',
                                                                    "&:hover": {
                                                                        backgroundColor: "green",
                                                                    },
                                                                }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                onClick={() => handleApprovalChange(order.orderId, "denied")}
                                                                sx={{
                                                                    m: 0.5, fontWeight: 'bold',
                                                                    "&:hover": {
                                                                        backgroundColor: "darkred",
                                                                    },
                                                                }}
                                                            >
                                                                Deny
                                                            </Button>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                              </TableBody>

                             
                         </Table>
                     </TableContainer>
                     
                      ) : (
                         <Typography align="center">No Approve request available</Typography>
                     )}
                       
                    </Grid>
                    )}
            </Box>
        </div>
  );
}