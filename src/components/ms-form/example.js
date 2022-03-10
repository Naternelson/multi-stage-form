import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Paper, TextField, Typography, Box, ClickAwayListener, InputAdornment, IconButton, Divider, Button, List, ListItem, ListItemText, Modal, Dialog } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import FormWrapper from ".";
import CarouselWrapper from "../carousel";
import Carousel from "../carousel/carousel";
import CarouselPage from "../carousel/page";
import log from "../log";
import FormField from "./form-field";
import useFormValidation from "./form-validator";
import FormPage from "./page";
import { actions } from "./slice";
import useFieldProps from "./useFieldProps";
import { confirmationValidation, emailValidation, fieldIsRequired, pageFields, pageFieldValidators, passwordValidation, requiredFields } from "./validations";

export default function ExampleForm(){
    return (
        <FormWrapper>
            <Paper sx={{width: "50vw", mx: 'auto', my: '2'}}>
                <Form/>
            </Paper>
            <Submission/>
        </FormWrapper>

    )
}

function Form(){
    useFormValidation()

    return (
        <Box as={"form"} onSubmit={(e)=> e.preventDefault()} >
            <PageOne/>
            <PageTwo/>
            <PageThree/>
        </Box>
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
    // const validations = [pageFields(fields), requiredFields(fields), pageFieldValidators(fields)]
    const pageMessage = selector(store => store.pages[id]?.ready) ? "Page 1 complete" : "End of Page 1"
    return (
        <FormPage idSetter={setId}>
            <Box sx={{p:2}}>
                <Typography variant="body1" align="center" sx={{py: 2}}>Page 1</Typography>
                <FormField {...emailProps}/>
                <ClickAwayListener onClickAway={onClickAway}>
                    <span>
                        <FormField {...passwordProps}/>
                        <FormField {...confirmationProps}/>
                    </span>
                </ClickAwayListener>
                <Typography variant="body2" align="center" sx={{py: 2}}>{pageMessage}</Typography>
            </Box>

            
        </FormPage>
    )
}

function PageTwo(){
    const [id, setId] = useState(null)
    const {dispatch, selector} = useContext(FormWrapper.Context)

    const firstNameProps = useFieldProps("first", {label: 'First Name'})
    const lastNameProps = useFieldProps("last", {label: 'Last Name'})
    const streetProps = useFieldProps("addressLineOne", {label: 'Street'})
    const line2Props = useFieldProps("addressLineTwo", {label: 'Line 2'})
    const cityProps = useFieldProps("city")
    const stateProps = useFieldProps("state")
    const zipProps = useFieldProps("zip")

    
    useEffect(()=>{
        dispatch(actions.validateFieldOnBlur({id: 'first', cb: fieldIsRequired("first name") }))
        dispatch(actions.validateFieldOnBlur({id: 'last', cb: fieldIsRequired("last name") }))
        dispatch(actions.validateFieldOnBlur({id: 'addressLineOne', cb: fieldIsRequired("street address") }))
        dispatch(actions.validateFieldOnBlur({id: 'city', cb: fieldIsRequired("city") }))
        dispatch(actions.validateFieldOnBlur({id: 'state', cb: fieldIsRequired("state") }))
        dispatch(actions.validateFieldOnBlur({id: 'zip', cb: fieldIsRequired("zipcode") }))
    },[])


    const fields = "first last addressLineOne addressLineTwo city state zip".split(/\s+/)
    // const validations = [pageFields(fields), requiredFields("first last addressLineOne city state zip".split(/\s+/)), pageFieldValidators(fields)]
    const pageMessage = selector(store => store.pages[id]?.ready) ? "Page 2 complete" : "End of Page 2"
    return (
        <FormPage idSetter={setId}>
            
            <Typography variant="body1" align="center" sx={{py: 2}}>Page 2</Typography>
            <FormField {...firstNameProps}/>
            <FormField {...lastNameProps}/>
            <Divider sx={{my:2}}/>
            <Typography variant="body2">Address</Typography>
            <Divider sx={{my:2}}/>
            <FormField {...streetProps}/>
            <FormField {...line2Props}/>
            <FormField {...cityProps}/>
            <FormField {...stateProps}/>
            <FormField {...zipProps}/>
            <Typography variant="body2" align="center" sx={{py: 2}}>{pageMessage}</Typography>
            
        </FormPage>
    )
}

function PageThree(){
    const [id, setId] = useState(null)
    const {dispatch, selector} = useContext(FormWrapper.Context)

    const companyNameProps = useFieldProps("company", {label: 'Company'})
    const roleProps = useFieldProps("role", {label: 'Role at company'})

    
    useEffect(()=>{
        dispatch(actions.validateFieldOnBlur({id: 'company', cb: fieldIsRequired("company") }))
        dispatch(actions.validateFieldOnBlur({id: 'role', cb: fieldIsRequired("role") }))

    },[])


    const fields = "company role".split(/\s+/)
    // const validations = [pageFields(fields), requiredFields(fields), pageFieldValidators(fields)]
    const pageMessage = selector(store => store.pages[id]?.ready) ? "Submit Form" : "End of Page 3"
    const pages = selector(store => store.pages)
    const formReady = Object.values(pages).every(p => p.ready === true)
    const submitForm = () => dispatch(actions.submitForm())
    return (
        <FormPage idSetter={setId}>
            
            <Typography variant="body1" align="center" sx={{py: 2}}>Page 3</Typography>
            <FormField {...companyNameProps}/>
            <FormField {...roleProps}/>
            <Box sx={{display: "flex" , justifyContent: 'center'}}>
                <Button variant="text"  disabled={!formReady} onClick={submitForm}>
                    <Typography variant="body2" align="center" sx={{py: 2}}>{pageMessage}</Typography>
                </Button>
            </Box>
            
        </FormPage>
    )
}

function Submission(){
    const {selector, dispatch} = useContext(FormWrapper.Context)
    const fields = selector(s => s.fields)
    const isOpened = selector(s => s.form.submitted)
    const closeHandler = () => dispatch(actions.unsubmitForm())
    return (
        <Paper>
            <Dialog open={isOpened} onClose={closeHandler} >
                <Paper sx={{overflow:"auto", width: 300, mx: 'auto'}}>
                <List>
                    {
                        Object.values(fields).map(field =>{ 
                            return <ListItem key={field.id}>
                                <ListItemText primary={field.id} secondary={field.value}/>
                            </ListItem>
                        })
                    }
                </List>
                </Paper>
            </Dialog>
        </Paper>


    )
}