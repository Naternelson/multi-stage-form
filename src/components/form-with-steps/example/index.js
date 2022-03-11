import { Box, Button, Paper } from "@mui/material";
import { useEffect } from "react";
import FormWithPages from "..";
import { useCurrentPage, useFormNavigation, useFormSelector } from "../hooks";
import PageOne from "./page-one";
import PageThree from "./page-three";
import PageTwo from "./page-two";

export default function ExampleForm(){
    const colCenterProps = {display: 'flex', flexDirection: 'column', justifyContent: 'center'}
    const wrapperProps = {sx: {...colCenterProps, height: "100vh"}}
    const contentProps = {sx: {...colCenterProps, width: "75%", height: "75%", mx: 'auto', px: 2, py: 1}}
    const borderBoxProps = {sx:{ py: 1, px: 2, width: "100%", height: "100%"}}
    return (
        <Box {...wrapperProps}>
            <Paper {...contentProps}>
                <Box sx={{m:2,  border: 1,  borderColor: 'grey.600'}}>
                    <Box {...borderBoxProps}>
                        <FormWithPages>
                            
                                <PageOne/>
                                <PageTwo/>
                                <PageThree/>
                            
                            <BottomNavBar last={2}/>
                        </FormWithPages>
                    </Box>
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
    const backProps = {onClick:backHandler, disabled: (index === 0), sx:{py: 2, width: "25%"}}
    const nextProps = {onClick: index === last ? submitHandler : nextHandler, disabled: !pageReady, sx:{py: 2, width: "25%"}}
    return <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Button {...backProps}>Back</Button>
        <Button {...nextProps}>{isLast ? "Submit" : "Next"}</Button>
    </Box>
}