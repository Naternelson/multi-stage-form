import { Email, Visibility, VisibilityOff }                         from "@mui/icons-material";
import { Box, ClickAwayListener, IconButton, Typography }           from "@mui/material";
import PasswordValidator                                            from "password-validator";
import { useContext, useState }                                     from "react";
import { FormContext, preventDefault, updateError, updateField }    from "../multi-stage-form";
import FormField                                                    from "../multi-stage-form/form-field";
import Step                                                         from "./step";

export default function StepOne(){
    const [passwordVisibility, setPassworVisibility]    = useState(false)
    const {dispatch, selector}                         = useContext(FormContext)
    const STEP                                          = 0
    const {email, password, passwordConfirmation} = selector(s => s.fields)
    const {email: emailError, password: passwordError, passwordConfirmation: confirmationError} = selector(s => s.errors)    
    const onChange                  =   (name) => ({target}) => {
        dispatch(updateField({name, value: target.value}))
        dispatch(updateError({name}))
    }

    const boxWrapperProps           =   { display:"flex", flexDirection:"column" }
    const textBoxProps              =   { sx: {pb: 1, borderBottom: 1} }
    const textOneProps              =   { variant: "body2" }
    const textTwoProps              =   { variant:"caption", color:"text.secondary" }
    const clickAwayProps            =   { onClickAway: () => setPassworVisibility(false) }
    const passwordIcon              =   <VisibilityIcon state={passwordVisibility} setState={setPassworVisibility}/>

    const emailBlur = ()=> {
        const msg = emailValidator(email)
        dispatch(updateError({value: msg, name: "email"}))
    }

    const passwordBlur = () => {
        const msg = pValidator(password)
        dispatch(updateError({value: msg, name: "password"}))
    }

    const confirmationBlur = () => {
        const msg = confirmationValidator(password, passwordConfirmation)
        dispatch(updateError({value: msg, name: "passwordConfirmation"}))
    }


    const emailProps                =   { value: email, type: 'email', onChange: onChange("email"), id:"email", sx:{mt:4}, onBlur: emailBlur, error: emailError }
    const passwordProps             =   { value: password, id: 'password', type: passwordVisibility ? "text" : "password", onChange: onChange("password"), onBlur: passwordBlur, error: passwordError }
    const passwordConfirmationProps =   { ...passwordProps, value: passwordConfirmation, id: 'passwordConfirmation', label: 'Confirm Password', onChange: onChange("passwordConfirmation"),  onBlur: confirmationBlur, error: confirmationError  }
    
    return (
        <Step step={STEP}>
            <Box {...boxWrapperProps}>
                <Box {...textBoxProps}>
                    <Typography {...textOneProps}>Let's get you started</Typography>
                    <Typography {...textTwoProps}>Create an account</Typography>
                </Box>
                <FormField {...emailProps}>
                    <Email color="inherit" fontSize="small"/>
                </FormField>
                <ClickAwayListener {...clickAwayProps}>
                    <Box>
                        <FormField {...passwordProps}>{passwordIcon}</FormField>
                        <FormField {...passwordConfirmationProps}>{passwordIcon}</FormField>
                    </Box>
                </ClickAwayListener>
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

let me = "Password1234"