import { Box } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import CustomConsole from ".";
const obj = {
    fn: (() => {}),
    func: function test(){
        console.log("hello world")
        console.log("hello world")
        console.log("hello world")
        console.log("hello world")
    }, 
    hello: 'world',
    foo: ['bar', 'testing', null, {hello: 'mom'}, [1234,56789]],
    yeash: ['bar', 'testing', null, {hello: 'mom'}, [1234,56789]],
}
export default function ExampleConsole(){
    const reducer = (state, action) => ({...state, ...action})
    const [store, dispatch] = useReducer(reducer, obj)

    return (
            <Box height={"100vh"} sx={{display: 'flex', direction: 'row'}}>
                <Box sx={{display:'flex', flexDirection: 'column', alignItems:"center", justifyContent: 'center', width: '75vw'}}>
                    This is the console!    
                </Box>
                <CustomConsole store={store} title={"Example"}/>

            </Box>
    )
}