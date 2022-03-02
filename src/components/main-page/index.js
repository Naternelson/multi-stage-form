import { Box, Button, Paper, Step, StepLabel, Stepper }             from "@mui/material";
import { useContext, useEffect, useRef, useState }                  from "react";
import MultiStageForm, { back, FormContext, next, preventDefault }  from "../multi-stage-form";
import TitleCard                                                    from "./title-card"
import {range}                                                      from "lodash"
import StepOne                                                      from "./step-one";
import StepTwo from "./step-two";
import StepWrapper from "./step-wrapper";

export default function MainPage(){
    return (
        <MultiStageForm steps={2}>
            <TitleCard/>
            <SignupForm/>
        </MultiStageForm>
    )
}

export function SignupForm(){
    return (
        <Paper component={"form"} onSubmit={preventDefault} sx={{maxWidth: "300px", mx:'auto'}}>
            <FormStepper/>
            <StepWrapper>
                <StepOne />
                <StepTwo />
            </StepWrapper>
            
            <BottomBar validations={formValidators}/>
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

export function BottomBar({validations}){
    const {selector, dispatch, state} = useContext(FormContext)
    const [ready, setReady] = useState(false)
    const {currentPage, steps} = selector(s => s)
    const isLast = currentPage === steps
    
    const boxSx = {display: "flex", p: 1, borderTop: 1, borderColor: 'divider', justifyContent: 'space-between'}
    const backButtonProps = {color: 'inherit', disabled: currentPage===0, onClick: () => dispatch(back())}
    const nextButtonProps = {color: isLast ? "success" : "inherit", disabled: !ready, onClick: () => {dispatch(next())}}
    const nextButtonLabel = isLast ? "Complete" : "Next"

    useEffect(()=>{
        validate(state, validations, currentPage)
            .then(valid => {
                setReady(valid)})
            .catch(showError("Couldn't run validations"))
    }, [state, validations, currentPage] )

    return (
        <Box sx={boxSx}>
            <Button {...backButtonProps}> Back </Button>
            <Button {...nextButtonProps}>{nextButtonLabel}</Button>
        </Box>
    )
}

export async function validate(state, validations, step) {
    return await validations[step](state)
}


const showError = label => err => {
    console.groupCollapsed(label)
    console.error(err)
    console.groupEnd()
}

const blankObj = obj => {
    return Object.keys(obj).length === 0
}

const standardValidator = (pageFields, requiredFields) => {
    return (state) => {
        requiredFields                          = requiredFields ? requiredFields : pageFields
        const   {fields, errors}                = state
        const   hasErrors                       = pageFields.map(key => errors[key]).some(val => val)
        if      (hasErrors)                     return false 
        if      (requiredFields.length === 0)   return true 
        if      (blankObj(fields))              return false 
        const   hasBlank                        = requiredFields.map(key => fields[key]).some(val => !val || val === "")
        if      (hasBlank)                      return false 
        return  true 
    }
}

export const formValidators = {
    0: (state) => {
        const  fields =          "email password passwordConfirmation".split(" ")
        const  std               = standardValidator(fields)(state)
        if     (!std)            return false 
        return state.fields.password === state.fields.passwordConfirmation 
    }, 
    1: (state) => {
        const fields    = "first last gender addressLineOne addressLineTwo city state zip".split(" ")
        const required  = fields.filter(k => k !== "addressLineTwo")
        const std       = standardValidator(fields, required)(state)
        if(!std)          return false 
        return true 
    }
}

