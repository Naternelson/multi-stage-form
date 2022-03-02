import { Email, Visibility, VisibilityOff }                         from "@mui/icons-material";
import { Box, ClickAwayListener, IconButton, Typography }           from "@mui/material";
import PasswordValidator                                            from "password-validator";
import { useContext, useState }                                     from "react";
import { FormContext, preventDefault, updateError, updateField }    from "../multi-stage-form";
import FormField                                                    from "../multi-stage-form/form-field";
import Step                                                         from "./step";

export default function StepTwo(){
    const {dispatch, selector} = useContext(FormContext)
    const STEP = 1
    const {email} = selector(s=> s.fields)

    const onChange = (name) => ({target}) => {
        dispatch(updateField({name, value: target.value}))
        dispatch(updateError({name}))
    }


    const boxWrapperProps = { display:"flex", flexDirection:"column" }
    const textBoxProps = { sx: {pb: 1, borderBottom: 1} }
    const textOneProps = { variant: "body2" }
    const textTwoProps = { variant:"caption", color:"text.secondary" }
    return (
        <Step step={STEP}>
            <Box {...boxWrapperProps}>
                <Box {...textBoxProps}>
                    <Typography {...textOneProps}>Awesome, now some basic information</Typography>
                    <Typography {...textTwoProps}>{`Username: ${email}`}</Typography>
                </Box>
                
            </Box>
        </Step>
    )
}

function VisibilityIcon({state, setState}){
    const iconButtonProps = {size: "small", sx: {p: 0}, onClick: () => setState(p => !p), onMouseDown: preventDefault}

    return <IconButton {...iconButtonProps}>
        {state ? <VisibilityOff/> : <Visibility />}
    </IconButton>
} 

const emailValidator = email => {
    if(!email || email === "") return "Email is required"
    if(!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email))) return "Invalid email"
}



const passwordSchema = new PasswordValidator() 
passwordSchema
    .is().min(8)
    .is().max(32)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()

const pValidator = password => {
    const arr = passwordSchema.validate(password, {list:true})
    const has = (val) => arr.includes(val)
    if(has("min") || has("max")) return "Password should be between 8-32 characters long"
    if(has("digits")) return "Password should have at least one number"
    if(has("uppercase")) return "Password should have at least one uppercase character"
    if(has("lowercase")) return "Password should have at least one lowercase character"
    if(arr.length > 0) return "Invalid password"
}


const confirmationValidator = (p, c) => {
    if(p !== c) return "Passwords do not match"
}