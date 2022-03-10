import { Box, Divider, Typography } from "@mui/material";
import FormField from "../field";
import FormPage from "../page";

export default function PageTwo(){
    const createValidations = () => {
        const arr = []
        const fn = (cb) => {
            arr.push(cb)
            return fn 
        }
        fn.show = arr 
        fn.add = fn 
        return fn 
    }

    const requiredCb = name => (value) => value.length === 0 && `${name} is required`
    const requiredValidator = (label) =>  createValidations().add(requiredCb(label)).show

    const firstBlur = requiredValidator("First Name")
    const lastBlur = requiredValidator("Last Name")
    const lineOneBlur = requiredValidator("Street Address")
    const cityBlur = requiredValidator("City")
    const stateBlur = requiredValidator("State")
    const zipBlur = requiredValidator("Zipcode")

    const firstProps = {id:"first", label:"First Name", type:"text", required:true, onBlurValidations: firstBlur}
    const middleProps = {id:"middle", label:"Middle Initial", type:"text"}
    const lastProps = {id:"last", label:"Last Name", type:"text", required: true, onBlurValidations: lastBlur}
    const lineOneProps = {id:"lineOne", label:"Street Address", type:"text", required: true, onBlurValidations: lineOneBlur}
    const lineTwoProps = {id:"lineTwo", label:"Line Two", type:"text", required: false}
    const cityProps = {id:"city", label:"City", type:"text", required: true, onBlurValidations: cityBlur}
    const stateProps = {id:"state", label:"State", SelectProps:{native: true}, select: true,  type:"text", placeholder: " ", required: true, onBlurValidations: stateBlur}
    const zipProps = {id:"zip", label:"Zipcode", type:"text", required: true, onBlurValidations: zipBlur}

    const divider = <Divider sx={{m: 2}}/>
    return (
        <FormPage index={1}>
            <Box display="flex" flexDirection={"column"} p={2} width={"75%"} mx="auto"> 
                <Typography align="center">Form</Typography>
                <FormField {...firstProps} />
                <FormField {...middleProps} />
                <FormField {...lastProps} />
                {divider}
                <FormField {...lineOneProps} />
                <FormField {...lineTwoProps} />
                <FormField {...cityProps}/> 
                <FormField {...stateProps} >
                        <StateList/>
                    
                </FormField>
                <FormField {...zipProps} />
            </Box>
            
        </FormPage>
    )
}

const states = 'AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(/\s+/)
states.unshift("")

function StateList(){
    return (
        states.map((state, i) => (
        <option key={state} value={state}>
            {state}    
        </option>
        ))
    )
}