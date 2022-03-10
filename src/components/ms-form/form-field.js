import { Box, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";

export default function FormField(props){
    const [height, setHeight] = useState(60)
    const fieldRef = useRef(null)
    
    useEffect(()=>{
        setHeight(fieldRef.current.scrollHeight)

    })
    const style = useSpring({height})
    return (
        <animated.div style={style}>
            <Box ref={fieldRef}>
                <TextField {...props} />
            </Box>
        </animated.div>
        
    )
}