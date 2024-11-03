import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
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
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function AdminView() {
  const [view, setView] = useState("items");
  const [restaurants, setRestaurants] = useState([]);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch approved restaurant data from API
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/guest/approved")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data); // Store all restaurant data
        } else {
          console.error("No restaurants found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Fetch pending restaurant approval requests
  useEffect(() => {
    const token = localStorage.getItem("adminJwtToken"); // Retrieve token from localStorage

    if (token) {
      setLoading(true);
      axios
        .get("http://localhost:8081/api/admin/pending", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        })
        .then((response) => {
          setLoading(false);
          const data = response.data;
          if (Array.isArray(data) && data.length > 0) {
            setApprovalRequests(data); // Store the approval request data
          } else {
            console.error("No pending approval requests found");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching approval requests:", error);
        });
    } else {
      setLoading(false);
      console.error("No token found");
    }
  }, []);

  // Function to handle removal of a restaurant
  const handleRemove = (restaurantEmailId) => {
    const token = localStorage.getItem("adminJwtToken"); // Retrieve token from localStorage

    if (restaurantEmailId && token) {
      axios
        .delete(`http://localhost:8081/api/admin/remove/${restaurantEmailId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        })
        .then((response) => {
          console.log("Restaurant removed:", response.data);

          // Remove the restaurant from the local state
          const updatedRestaurants = restaurants.filter(
            (restaurant) => restaurant.restaurantEmailId !== restaurantEmailId
          );
          setRestaurants(updatedRestaurants);
        })
        .catch((error) => {
          console.error("Error removing restaurant:", error);
        });
    } else {
      console.error("Invalid restaurantEmailId or missing token");
    }
  };

  // Function to handle approval or denial of a restaurant
  const handleApprovalChange = (restaurantEmailId, status) => {
    const token = localStorage.getItem("adminJwtToken"); // Retrieve token from localStorage

    if (restaurantEmailId && token) {
      axios
        .put(
          `http://localhost:8081/api/admin/${status === "approved" ? "approve" : "deny"}/${restaurantEmailId}`,
          { approvalStatus: status }, // Pass the status to the API
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        )
        .then((response) => {
          if (status === "approved") {
            const updatedRequests = approvalRequests.filter(
              (restaurant) => restaurant.restaurantEmailId !== restaurantEmailId
            );
            setApprovalRequests(updatedRequests);
            setRestaurants((prevRestaurants) => [
              ...prevRestaurants,
              response.data, // Assuming the response contains the updated restaurant data
            ]);
          } else {
            const updatedRequests = approvalRequests.filter(
              (restaurant) => restaurant.restaurantEmailId !== restaurantEmailId
            );
            setApprovalRequests(updatedRequests);
          }
        })
        .catch((error) => {
          console.error("Error updating approval status:", error);
        });
    } else {
      console.error("Invalid restaurantEmailId or missing token");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Buttons to toggle views */}
      <Box p={2} textAlign="center">
        <Button
          variant={view === "items" ? "contained" : "outlined"}
          onClick={() => setView("items")}
          sx={{
            m: 1,
            backgroundColor: view === "items" ? "orange" : "white",
            color: view === "items" ? "white" : "black",
            borderColor: "orange",
            "&:hover": {
              backgroundColor: view === "items" ? "darkorange" : "lightgray",
            },
          }}
        >
          List of Restaurants
        </Button>
        <Button
          variant={view === "approval" ? "contained" : "outlined"}
          onClick={() => setView("approval")}
          sx={{
            m: 1,
            backgroundColor: view === "approval" ? "orange" : "white",
            color: view === "approval" ? "white" : "black",
            borderColor: "orange",
            "&:hover": {
              backgroundColor: view === "approval" ? "darkorange" : "lightgray",
            },
          }}
        >
          Restaurant Approval
        </Button>
      </Box>

      {/* Main Content */}
      <Box p={3}  >
        <Grid container spacing={3}>
          {view === "items" && (
            <Grid item xs={12}>
              {/* List of Restaurants */}
              {restaurants.length > 0 ? (
                <TableContainer component={Paper} align="center">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Restaurant Image</TableCell>
                        <TableCell>Restaurant Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Contact number</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {restaurants.map((restaurant) =>
                          <TableRow>
                            <TableCell>
                              <img
                                src={`http://localhost:8081/api/images/restaurant/${restaurant.restaurantEmailId}/${restaurant.restaurantImageFileName}`}
                                alt={restaurant.restaurantName}
                                style={{ width: "100px", height: "100px" }}
                              />
                            </TableCell>
                            <TableCell>{restaurant.restaurantName}</TableCell>
                            <TableCell>{restaurant.type}</TableCell>
                            <TableCell>{restaurant.category}</TableCell>
                            <TableCell>{restaurant.location}</TableCell>
                            <TableCell>{restaurant.contactNumber}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() =>
                                  handleRemove(restaurant.restaurantEmailId)
                                }
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No restaurants available</Typography>
              )}
            </Grid>
          )}

{view === "approval" && (
  <Grid item xs={12}>
    {/* List of Pending Approvals */}
    {loading ? (
      <CircularProgress />
    ) : approvalRequests.length > 0 ? (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Restaurant Image</TableCell>
              <TableCell>Restaurant Name</TableCell>
              <TableCell>Restaurant Email</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {approvalRequests.map((restaurant) => (
    <TableRow key={restaurant.restaurantEmailId}>
      <TableCell>
        <img
          src={`http://localhost:8081/api/images/restaurant/${restaurant.restaurantEmailId}/${restaurant.restaurantImageFileName}`}
          alt={restaurant.restaurantName}
          style={{ width: "100px", height: "100px" }}
        />
      </TableCell>
      <TableCell>{restaurant.restaurantName}</TableCell>
      <TableCell>{restaurant.restaurantEmailId}</TableCell>
      <TableCell>{restaurant.type}</TableCell>
      <TableCell>{restaurant.category}</TableCell>
      <TableCell>{restaurant.location}</TableCell>
      <TableCell>{restaurant.contactNumber}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="success"  // Green color for Approve
          onClick={() =>
            handleApprovalChange(restaurant.restaurantEmailId, "approved")
          }
          sx={{
            m: 1,
            "&:hover": {
              backgroundColor: "green",  // Darker green on hover
            },
          }}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"  // Red color for Deny
          onClick={() =>
            handleApprovalChange(restaurant.restaurantEmailId, "denied")
          }
          sx={{
            m: 1,
            "&:hover": {
              backgroundColor: "darkred",  // Darker red on hover
            },
          }}
        >
          Deny
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    ) : (
      <Typography>No pending approval requests</Typography>
    )}
  </Grid>
)}

        </Grid>
      </Box>
    </div>
  );
}
