import { Box, Divider, Typography } from "@mui/material";
import FormField from "../field";
import FormPage from "../page";

export default function PageThree(){
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

    const companyBlur = requiredValidator("Company Name")
    const roleBlur = requiredValidator("Role")

    const companyProps = {id:"company", label:"Company Name", type:"text", required:true, onBlurValidations: companyBlur}
    const roleProps = {id:"role", label:"Role at Company", type:"text", required:true, onBlurValidations: roleBlur}


    return (
        <FormPage index={2}>
            <Box display="flex" flexDirection={"column"} p={2} width={"75%"} mx="auto"> 
                <Typography align="center">Form</Typography>
                <FormField {...companyProps} />
                <FormField {...roleProps} />
            </Box>
            
        </FormPage>
    )
}