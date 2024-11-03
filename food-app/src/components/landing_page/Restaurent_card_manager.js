import { AppBar, Container, Toolbar, Typography, Stack, Button, Box } from "@mui/material";
import Restaurent_card_lists from "./Restaurent_card_lists";
import { useContext, useState } from "react";
import { categoryContext } from "../../App";

export default function Restaurent_card_manager({ restaurants }) {
    const [focusedType, setFocusedType] = useState(null);
    const { type, setType } = useContext(categoryContext); // Use type instead of category
    
    return (    
        <div>
            <AppBar position="static" sx={{ backgroundColor: '#F9A01A', marginTop: 2 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography noWrap variant="h5">List of Restaurants Available</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Stack spacing={2} direction="row" sx={{ float: 'right' }}>
                            {['all', 'VEG', 'NON_VEG'].map(type => (
                                <Button
                                    key={type}
                                    onFocus={() => setFocusedType(type)}
                                    onBlur={() => setFocusedType(null)}
                                    color="inherit"
                                    onClick={() => { setType(type); }}
                                    sx={{
                                        color: focusedType === type ? 'black' : 'white',
                                        fontSize: '20px',
                                        height: '5vh',
                                        marginTop: '-20px',
                                        textTransform: 'capitalize',
                                        backgroundColor: focusedType === type ? '#ffc060' : 'inherit',
                                        '&:hover': { backgroundColor: '#ffc060' }
                                    }}>
                                    {type.replace('_', ' ')}
                                </Button>
                            ))}
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
            <Restaurent_card_lists type={type} restaurent={restaurants} />
        </div>
    );
}
