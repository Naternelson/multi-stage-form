import { ArrowBack } from "@mui/icons-material";
import { Collapse } from "@mui/material";
import CustomConsole from ".";

export default function AppWrapper(){
    const dev = process.env.NODE_ENV === "development"
    return (
        <Box sx={{height: "100vh", display: 'flex', flexDirection: 'row', position: 'relative'}}>
            {dev && (
            <Collapse>
                <ArrowBack sx ={{position: 'absolute', top: "50%", transform: 'translate(-50%, -50%)' }}/>
                <CustomConsole/>
            </Collapse>)}
            <Box>
                Rest of the app

            </Box>
        </Box>
    )
}