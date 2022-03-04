import { Email, Visibility, VisibilityOff }                         from "@mui/icons-material";
import { Box, ClickAwayListener, Divider, IconButton, MenuItem, Typography }           from "@mui/material";
import PasswordValidator                                            from "password-validator";
import { useContext, useState }                                     from "react";
import { FormContext, preventDefault, updateError, updateField }    from "../multi-stage-form";
import FormField, { SelectField }                                                    from "../multi-stage-form/form-field";
import Step                                                         from "./step";

export default function StepTwo(){
    const {dispatch, selector} = useContext(FormContext)
    const STEP = 1
    const {gender, email} = selector(s=> s.fields)

    const onChange = (name) => ({target}) => {
        dispatch(updateField({name, value: target.value}))
        dispatch(updateError({name}))
    }


    const boxWrapperProps = { display:"flex", flexDirection:"column" }
    const textBoxProps = { sx: {pb: 1, borderBottom: 1} }
    const textOneProps = { variant: "body2" }
    const textTwoProps = { variant:"caption", color:"text.secondary" }
    
    const firstNameProps = {onChange: onChange("first"), sx:{mt:2}, label: "First Name", id: "first"}
    const lastNameProps = {onChange: onChange("last"), label: "Last Name", id: "last"}
    const genderProps = {onChange: onChange("gender"), value: gender || "", id: "gender"}
    const addresOneProps = {onChange: onChange("addressLineOne"), label: "Street", id: "addresLineOne", sx:{mt:2}}
    const addresTwoProps = {onChange: onChange("addressLineTwo"), label: "Line Two", id: "addresLineTwo"}
    const cityProps = {onChange: onChange("city"), id: "city"}
    const stateProps = {onChange: onChange("state"), id: "state"}
    const zipProps = {onChange: onChange("zip"), id: "zip"}

    return (
        <Step step={STEP}>
            <Box {...boxWrapperProps}>
                <Box {...textBoxProps}>
                    <Typography {...textOneProps}>Awesome, now some basic information</Typography>
                    <Typography {...textTwoProps}>{`Username: ${email}`}</Typography>
                </Box>
                <FormField {...firstNameProps}/>
                <FormField {...lastNameProps}/> 
                <SelectField {...genderProps}>
                    {["Female", "Male", "Other", "Prefer not to say"].map(g => {
                        return <MenuItem dense value={g.toLowerCase()} key={g}>{g}</MenuItem>
                    })}
                </SelectField>
                <Divider/>
                <Box {...textBoxProps} pt={1}>
                    <Typography {...textOneProps}>Address</Typography>
                </Box>
                <FormField {...addresOneProps}/>
                <FormField {...addresTwoProps}/>
                <FormField {...cityProps}/>
                <FormField {...stateProps}/>
                <FormField {...zipProps}/>
            </Box>
        </Step>
    )
}
