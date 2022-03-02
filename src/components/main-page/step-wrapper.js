import { Box } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "../multi-stage-form";

const StepsContext = createContext()

export default function StepWrapper(props){
    const {selector} = useContext(FormContext)
    const [value, setValue] = useState(null)
    const wrapperRef = useRef(null)
    const height = selector(s => s.size)

    useEffect(()=>{
        if(Object.keys(wrapperRef.current).length > 0) setValue(wrapperRef.current)
    }, [wrapperRef.current])

    return (
        <Box {...props} sx={{position: 'relative', overflow: 'hidden', height, ...(props.sx || {}) }} ref={wrapperRef}>
            <StepsContext.Provider value={value}>
                {props.children}
            </StepsContext.Provider>
        </Box>
    
)
}

StepWrapper.context = StepsContext