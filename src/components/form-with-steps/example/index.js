import { Box, Button, Paper } from "@mui/material";
import { useEffect } from "react";
import FormWithPages from "..";
import { useCurrentPage, useFormNavigation, useFormSelector } from "../hooks";
import PageOne from "./page-one";
import PageThree from "./page-three";
import PageTwo from "./page-two";

export default function ExampleForm(){
    const wrapperProps = {sx: {display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: "100vh"}}
    const contentProps = {sx: {width: "75%", minWidth: "25%", mx: 'auto', px: 2, py: 1}}
    const borderBoxProps = {sx:{ py: 1, px: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
    return (
        <Box {...wrapperProps}>
            <Paper {...contentProps}>
                <Box sx={{m:2,  border: 1,  borderColor: 'grey.600'}}>
                    <FormWithPages>
                        <Box {...borderBoxProps}>
                            <PageOne/>
                            <PageTwo/>
                            <PageThree/>
                        </Box>
                        <BottomNavBar last={2}/>
                    </FormWithPages>
                </Box>

            </Paper>
        </Box>
    )
}

function BottomNavBar({last}){
    const [page,index] = useCurrentPage()
    const pageReady = useFormSelector(s => s.pages[page?.id]?.ready, [page?.id, index])
    const travel = useFormNavigation()
    const nextHandler = () => {
        travel(index + 1)
    }
    const backHandler = () => {
        travel(index - 1)
    }
    const submitHandler = () => {
        alert("Submitted")
    }
    const isLast = index === last
    const backProps = {onClick:backHandler, sx:{py: 2, width: "25%", display: index > 0 ? "block" : 'none'}}
    const nextProps = {onClick: index === last ? submitHandler : nextHandler, sx: {...backProps.sx, display: pageReady ? "block": "none"}, }
    return <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Button {...backProps}>Back</Button>
        <Button {...nextProps}>{isLast ? "Submit" : "Next"}</Button>
    </Box>
}