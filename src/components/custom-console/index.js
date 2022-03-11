import { Box, ButtonBase, Collapse, Divider, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { createTheme } from "@mui/material";
import { ArrowDropUp, ArrowRight } from "@mui/icons-material";
import { animated, useSpring } from "react-spring";


const theme = createTheme({
    palette: {
        mode: 'light'
    },
    typography: {
        fontSize: 12
    }
})

const isObject = obj => {
    if(obj === null) return false 
    if(obj === undefined) return false
    if(typeof obj !== "object") return false 
    return true 
}
const isArray = obj => {
    if(Array.isArray(obj)) return true 
    return false 
}

export default function CustomConsole({store, height, title}){
    const wrapperProps ={sx:{display: 'flex', flexDirection: 'column', height: height || "100vh", flex: 1}}
    const emptyProps = {sx: {display: !store ? 'flex': 'none', alignItems:"center", justifyContent: 'center', flexDirection: 'column', maxHeight: "100%"}}
    const consoleProps = {sx: {display: !!store ? 'flex': 'hidden', flexDirection: 'column', mt:5, overflow: 'auto', maxHeight: "100%", pb:2, px:2, borderBottom: 1, borderColor: "grey.400"}}
    return (
        <ThemeProvider theme={theme}>
            <Box {...wrapperProps}>
                <Box {...emptyProps}>Nothing to Show!</Box>
                <Box {...consoleProps}>
                    <Typography align={"center"} variant={"h5"} mb={5}>{title}</Typography>
                    {
                        Object.entries(store).map(([key, value]) => (
                            <ConsoleRow objectKey={key} key={key} value={value}/>)
                        )
                    }
                </Box>
            </Box>
        </ThemeProvider>
    
    )
}

function ConsoleRow({objectKey, value}){
    const [open, setOpen] = useState(false)
    const isFn = typeof value === "function"
    const isPrimative = !isObject(value)
    const titleEnding = isFn ? 
        `${value.toString()}` : isPrimative ? 
        `${JSON.stringify(value, null).replaceAll("\n","")}` : isArray(value) && !open ?  
        "[...]"    : isArray(value) && open ? 
        "["        : !open ?
        "{...}"    : "{"
    const ending = isArray(value) ? "]" : isObject(value) ? "}" : ""
    const toggle = e => !e 
    const [style, api] = useSpring(() => ({ from: {backgroundColor: "rgba(255,255,255,1)"}, to: {backgroundColor: "rgba(255,255,255,0)"}}))
    useEffect(()=>{
        api.start()
    },[])

    useEffect(()=>{
        console.log(value)
        api.start({reset: true})
    },[JSON.stringify(value)])
    return (
        <animated.div style={style}>
            <Box>
                <ButtonBase sx={{alignItems: 'stretch'}} onClick={() => setOpen(toggle)} disabled={typeof value !== "object"}>
                    {!isPrimative && !open && <ArrowRight/>}
                    {!isPrimative && open && <ArrowDropUp/>}
                    {isPrimative && <ArrowRight sx={{visibility:'hidden'}}/>}
                    <Typography>{objectKey}:</Typography>
                    <Typography align="left" sx={{ml: 1, color: 'grey.400'}}>{titleEnding}</Typography>
                    
                </ButtonBase>
                
                <Collapse in={open}>
                    <Box sx={{ml: 2, borderLeft: 1, borderColor: 'grey.400'}}>
                        <Box sx={{pl:2}}>
                            {isObject(value) && Object.entries(value).map(([key, value]) => <ConsoleRow objectKey={key} key={key} value={value}/>)}
                        </Box>
                    <Typography sx={{pl: 3, color: 'grey.400'}}>{`${ending}`}</Typography>
                    </Box>
                </Collapse>
            </Box>
        </animated.div>            
    )
}

