import { Box, Typography } from "@mui/material";
import FormField from "../field";
import FormPage from "../page";

export default function PageOne(){
    const createValidations = () => {
        const arr = []
        const fn = (cb) => {arr.push(cb)}
        fn.show = arr 
        return fn 
    }


    const emailBlurValidations = createValidations()
    emailBlurValidations((value) => !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) && "Incorrect email format" )
    
    const passwordBVals = createValidations()
    passwordBVals((value)=> value.length < 5 && "Password should be more than 5 characters in length")
    passwordBVals((value)=> value.length > 50 && "Password should be less than 50 characters in length")
    passwordBVals((value)=> !(/[a-z]+/.test(value)) && "Password should have 1 or more lowercase characters")
    passwordBVals((value)=> !(/[A-Z]+/.test(value)) && "Password should have 1 or more uppercase characters")
    passwordBVals((value)=> !(/\d+/.test(value)) && "Password should have 1 or more number")

    const passwordCVals = createValidations()
    passwordCVals((value, field, store) => {
        const confirmation = store.fields.passwordConfirmation.value
        if(confirmation && confirmation !== "") return value !== confirmation && "Passwords should match"
    })

    const confirmationCVals = createValidations()
    confirmationCVals((value, field, store) => value !== "" && store.fields.password.value !== value && "Passwords should match") 

    return (
        <FormPage index={0}>
            <Box display="flex" flexDirection={"column"} p={2} width={"75%"} mx="auto"> 
                <Typography align="center">Form</Typography>
                <FormField id="email" label={"Email"} type="email" required onBlurValidations={emailBlurValidations.show} />
                <FormField id="password" label={"Password"} type="password" required onBlurValidations={passwordBVals.show} onChangeValidations={passwordCVals.show} />
                <FormField id="passwordConfirmation" label={"Confirm Password"} type="password" required onChangeValidations={confirmationCVals.show} />
            </Box>
            
        </FormPage>
    )
}