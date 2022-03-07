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
    const colors = "#5FA619 #244EF2 #F25324".split(" ")
    const boxProps = (index)=>({sx: {display: "flex", borderRadius: "5px", height: `${index * 25 + 25}vh`, bgcolor: colors[index] ,justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',p: 3}})
    
    return(
        <Box sx={{display: 'flex', height: "100vh", justifyContent: 'space-around', flexDirection: 'column'}}>
            <Paper sx={{mt: 2, p:1, mx: 'auto', width: "75%" }}>
                <Carousel>
                    <CarouselPage>
                        <Box {...boxProps(0)}>
                            <Typography variant="h1">   Page One   </Typography>
                            <Typography variant="body2">    How you doing   </Typography>
                        </Box>
                    </CarouselPage>
                    <CarouselPage>
                        <Box {...boxProps(1)}>
                            <Typography variant="h1">   Page Two   </Typography>
                            <Typography variant="body2">    This demonstrates another page  </Typography>
                        </Box>
                    </CarouselPage>
                    <CarouselPage>
                        <Box {...boxProps(2)}>
                            <Typography variant="h1">   Page Three  </Typography>
                            <Typography variant="body2">    This is the final page, but we loop back to the front!  </Typography>
                        </Box>
                    </CarouselPage>
                    
                </Carousel>
                <ButtonGroup fullWidth sx={{mt: 1}}>
                    <Button onClick={navigateBack} sx={{color: 'text.secondary'}} variant="text">Back</Button>
                    <Button onClick={navigateForward} sx={{color: 'text.secondary'}} variant="text">Forward</Button>
                </ButtonGroup>
            </Paper>
        </Box>
        
    )
}