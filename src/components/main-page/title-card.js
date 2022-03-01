import { Box, Typography } from "@mui/material";

export default function TitleCard(){
    return (
        <Box item xs={12} textAlign="center" my={"25px"}>
            <img height="50px" src="/logo192.png" alt={"example-logo"}/>
            <Typography sx={{letterSpacing: ".05rem", color: "text.secondary", borderBottom: "1px"}} fontWeight={100} fontSize={"1.5rem"} variant={"h1"}>Create a Dummy Account</Typography>
        </Box>
    )
}