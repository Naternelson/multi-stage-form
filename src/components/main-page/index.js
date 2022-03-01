import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { useContext, useEffect } from "react";
import MultiStageForm, { back, FormContext, next, preventDefault } from "../multi-stage-form";
import TitleCard from "./title-card"
import {range} from "lodash"

export default function MainPage(){
    return (
        <MultiStageForm steps={2}>
            <TitleCard/>
            <SignupForm/>
        </MultiStageForm>
    )
}

export function SignupForm(){
    const {selector, dispatch} = useContext(FormContext)
    
    return (
        <Paper component={"form"} onSubmit={preventDefault} sx={{maxWidth: "300px", mx:'auto'}}>
            <FormStepper/>

            <BottomBar/>
        </Paper>

    )
}

export function FormStepper(){
    const {selector} = useContext(FormContext)
    const currentPage = selector(state => state.currentPage)
    const steps = selector(state => state.steps) + 1
    const labels = range(0, steps).map(i => <Step key={i}><StepLabel/></Step>)
    return (
        <Stepper alternativeLabel activeStep={currentPage} sx={{py: 2}}>
            {labels}
        </Stepper>
    )
}

export function BottomBar(){
    const {selector, dispatch} = useContext(FormContext)
    const {currentPage, steps} = selector(s => s)
    const isLast = currentPage === steps
    const boxSx = {display: "flex", p: 1, borderTop: 1, borderColor: 'divider', justifyContent: 'space-between'}
    const backButtonProps = {color: 'inherit', disabled: currentPage===0, onClick: () => dispatch(back())}
    const nextButtonProps = {color: isLast ? "success" : "inherit", disabled: false, onClick: () => dispatch(next())}
    const nextButtonLabel = isLast ? "Complete" : "Next"
    return (
        <Box sx={boxSx}>
            <Button {...backButtonProps}> Back </Button>
            <Button {...nextButtonProps}>{nextButtonLabel}</Button>
        </Box>
    )
}