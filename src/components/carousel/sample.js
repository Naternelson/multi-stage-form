import { Box, Button, ButtonGroup, Paper, Typography } from "@mui/material";
import CarouselWrapper from ".";
import Carousel from "./carousel";
import { CarouselPage } from "./page";
import usePageNavigation from "./usePageNavigation";

export default function SampleCarousel(){
    
    
    return (
        <CarouselWrapper>
            <InnerContents/>
        </CarouselWrapper>
        
    )
}

function InnerContents(){
    const {navigateBack, navigateForward} = usePageNavigation()
    return(
        <Paper sx={{mt: 6, mx: 'auto', width: "500px"}}>
            <Carousel>
                <CarouselPage>
                    <Box sx={{display: "flex", justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',p: 3}}>
                        <Typography variant="h1">
                            Page One
                        </Typography>
                        <Typography variant="body2">
                            How you doing
                        </Typography>
                    </Box>
                </CarouselPage>
                <CarouselPage>
                    <Box sx={{display: "flex", justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',p: 3}}>
                        <Typography variant="h1">
                            Page 2
                        </Typography>
                        <Typography variant="body2">
                            This demonstrates another page
                        </Typography>
                    </Box>
                </CarouselPage>
                <CarouselPage>
                    <Box sx={{display: "flex", justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',p: 3}}>
                        <Typography variant="h1">
                            Page 3
                        </Typography>
                        <Typography variant="body2">
                            This is the final page, but we loop back to the front!
                        </Typography>
                    </Box>
                </CarouselPage>
            </Carousel>
            <ButtonGroup>
                <Button onClick={navigateBack} variant="contained">Back</Button>
                <Button onClick={navigateForward} variant="contained">Forward</Button>
            </ButtonGroup>
        </Paper>
    )
}