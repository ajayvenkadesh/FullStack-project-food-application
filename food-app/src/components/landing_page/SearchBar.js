import React from "react";
import { styled, InputBase, IconButton,alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: alpha(theme.palette.common.white, 0.8),color:"black",
  '&:hover': {
     backgroundColor: alpha(theme.palette.common.white, 1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 20, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function SearchBar({ searchTerm, setSearchTerm, setFilterData }) {
  
  // Handle the search event, e.g., on pressing 'Enter' or clicking the search button
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      setFilterData("");  // Reset filter data when searching
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Search when the user presses 'Enter'
    }
  };

  return (
    <Search>
      <StyledInputBase
        placeholder="Search restaurants"
        inputProps={{ "aria-label": "search" }}
        value={searchTerm} // Bind input value to searchTerm state
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        onKeyDown={handleKeyDown} // Call search on 'Enter' key press
      />
      <IconButton 
        sx={{ p: "10px" }} 
        onClick={handleSearch} // Call search on button click
      >
        <SearchIcon />
      </IconButton>
    </Search>
  );
}
