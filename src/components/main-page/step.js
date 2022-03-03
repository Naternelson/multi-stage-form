import { Box, Slide, Typography } from "@mui/material";
import { startCase } from "lodash";
import { useContext, useRef, useEffect, useState } from "react";
import { FormContext, resize } from "../multi-stage-form";
import StepWrapper from "./step-wrapper";

export default function Step({step, children}){
    const [enterDirection, setDirection] = useState("left")
    const {selector, dispatch} =  useContext(FormContext)
    const container = useContext(StepWrapper.context)
    const currentPage = selector(s => s.currentPage)
    const addEndListener =  () => !setDirection(direction => (direction === "left" ? "right" : "left") )
    const slideProps = {container, appear:false, addEndListener, direction: enterDirection, in: currentPage === step}
    const childRef = useRef(null)

    useEffect(()=>{
        
        if(currentPage === step) dispatch(resize(childRef.current?.offsetHeight))
    }, [currentPage])

    useEffect(()=>{
        if(step === 0) setDirection("right")
    }, [step])

    return (
        <Slide {...slideProps}>
            <Box ref={childRef} position="absolute" sx={{p: 2, y: 0}}>
                
                {children}
                <Typography sx={{textAlign: 'center'}}>{`${enterDirection}`}</Typography>
            </Box>
        </Slide>
        
    )
}