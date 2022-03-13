import { Box, Button, ButtonBase, Collapse, Divider, Paper, ThemeProvider, Typography, useScrollTrigger } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createTheme } from "@mui/material";
import { ArrowDropUp, ArrowRight } from "@mui/icons-material";
import { animated, useSpring } from "react-spring";


const theme = createTheme({
    palette: {
        mode: 'dark'
    },
    typography: {
        fontSize: 11
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

const Context = createContext()
export default function CustomConsole({title}){
    const [currentStore, setCurrent] = useState(null)
    const stores = useRef({})
    const location = useScrollTrigger()
    
    const store = stores.current[currentStore] || {}
    const wrapperProps ={sx:{display: 'flex', borderLeft: "3px double", borderColor: "grey.400", my:2, flexDirection: 'column',flex: 1, justifyContent: 'space-between'}}
    const emptyProps = {sx: {display: !store ? 'flex': 'none', alignItems:"center", justifyContent: 'center', flexDirection: 'column', maxHeight: "100%"}}
    const consoleProps = {sx: {display: !!store ? 'flex': 'none', flex: 1, flexDirection: 'column', mt:1, overflow: 'auto', maxHeight: "100%", pb:2, px:2}}
    const bottomBarProps = {sx:{borderTop: 1, p:1, m:1, borderColor: "grey.400"}}

    useEffect(()=>{
        stores.current[1] = {
            fn: (() => {}),
            hello: 'world',
            foo: ['bar', 'testing', null, {hello: 'mom'}, [1234,56789]],
            yeash: ['bar', 'testing', null, {hello: 'mom'}, [1234,56789, "asdjlfkjasd"]],
            location
        }
        stores.current[-1] = {try: 'word'}
        setCurrent(1)
    },[])
    return (            
        <Context.Provider value={{}}>
            <Box {...wrapperProps}>
                <Box {...emptyProps}>Nothing to Show!</Box>
                <Typography align={"center"} variant={"h5"}>{title}</Typography>
                
                    <Box {...consoleProps}>
                        <Paper sx={{p:1}}>
                            {
                                Object.entries(store).map(([key, value]) => (
                                    <ConsoleRow objectKey={key} key={key} value={value}/>)
                                )
                            }
                            </Paper>
                    </Box>
                

                <Box {...bottomBarProps}>
                    <Button onClick={()=>{setCurrent(c => c * -1)}} fullWidth>
                        Change
                    </Button>
                </Box>
            </Box>
        </Context.Provider>    
    )
}
CustomConsole.Context = Context

function ConsoleRow({objectKey, value}){
    console.log(typeof value)
    const [open, setOpen] = useState(false)
    const isFn = typeof value === "function"
    const isPrimative = !isObject(value)
    const titleEnding = (() => {
        try{
            return isFn ? 
            `${value.toString()}` : isPrimative ? 
            `${JSON.stringify(value, null).replaceAll("\n","")}` : isArray(value) && !open ?  
            "[...]"    : isArray(value) && open ? 
            "["        : !open ?
            "{...}"    : "{"
        } catch {
            return "ERROR"
        }
    })()
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
                    </Box>
                    <Typography sx={{pl: 3, color: 'grey.400'}}>{`${ending}`}</Typography>
                </Collapse>
            </Box>
        </animated.div>            
    )
}

