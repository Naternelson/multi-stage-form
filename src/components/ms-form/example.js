import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Paper, TextField, Typography, Box, ClickAwayListener, InputAdornment, IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import FormWrapper from ".";
import log from "../log";
import FormField from "./form-field";
import FormPage from "./page";
import { actions } from "./slice";
import useFieldProps from "./useFieldProps";
import { confirmationValidation, emailValidation, pageFields, pageFieldValidators, passwordValidation, requiredFields } from "./validations";

export default function ExampleForm(){
    
    return (
        <FormWrapper>
            <Paper sx={{width: "50vw", mx: 'auto', my: '2'}}>
                <Box as={"form"} onSubmit={(e)=> e.preventDefault()} sx={{p: 2}}>
                    <PageOne/>
                </Box>
            </Paper>
        </FormWrapper>

    )
}

function PageOne(){
    const [id, setId] = useState(null)
    const {dispatch, selector} = useContext(FormWrapper.Context)
    const [passwordType, setPasswordType] = useState("password")
    const [confirmationType, setConfirmationType] = useState("password")
    const setterCb = current => current === "password" ? "text" : "password"
    const passwordFieldAdornment = (type, setter) => {
        return (
            <InputAdornment position="end" >
                <IconButton onClick={() => setter(setterCb)}>
                    {type === "password" ? <Visibility/> : <VisibilityOff/>}
                </IconButton>
            </InputAdornment>
        )
    }

    const emailProps = useFieldProps("email")
    const passwordProps = useFieldProps("password", {
        type: passwordType, 
        InputProps: {endAdornment: passwordFieldAdornment(passwordType, setPasswordType)}
    })
    const confirmationProps = useFieldProps("passwordConfirmation", {
        label: "Confirm Password", 
        type: confirmationType,
        InputProps: {endAdornment: passwordFieldAdornment(confirmationType, setConfirmationType)}
    })

    const onClickAway = () => setPasswordType("password") || setConfirmationType("password")
    
    useEffect(()=>{
        dispatch(actions.validateFieldOnBlur({id: "email", cb: emailValidation}))
        dispatch(actions.validateFieldOnBlur({id: "password", cb: passwordValidation}))
        dispatch(actions.validateFieldOnChange({id: 'passwordConfirmation', cb: confirmationValidation}))
    },[])


    const fields = "email password passwordConfirmation".split(/\s+/)
    const validations = [pageFields(fields), requiredFields(fields), pageFieldValidators(fields)]
    const pageMessage = selector(store => store.pages[id]?.ready) ? "Page 1 complete" : "End of Page 1"
    return (
        <FormPage idSetter={setId} validations={validations}>
            
            <Typography variant="body1" align="center" sx={{py: 2}}>Page 1</Typography>
            <FormField {...emailProps}/>
            <ClickAwayListener onClickAway={onClickAway}>
                <span>
                    <FormField {...passwordProps}/>
                    <FormField {...confirmationProps}/>
                </span>
            </ClickAwayListener>
            {/* {selector(store => store.pages[id]?.ready) && <Typography align="center" >Ready!</Typography>} */}
            <Typography variant="body2" align="center" sx={{py: 2}}>{pageMessage}</Typography>
            
        </FormPage>
    )
}