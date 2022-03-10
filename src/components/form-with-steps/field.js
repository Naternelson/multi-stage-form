import { TextField } from "@mui/material";
import { startCase } from "lodash";
import { useEffect } from "react";
import log from "../log";
import { useFieldValidation } from "./hooks";

export default function FormField({children, options, id, ...props}){
    const kids = children ? children : null
    const [fieldProps, field] = useFieldValidation(id, props, options)
    
    useEffect(()=>{
        if(field?.pageId) log(`${startCase(field.id)} Field Created`, ["Field Props",fieldProps], ["Field",field]    )
    },[field?.pageId, field?.id])

    return (
        <TextField variant={"filled"}  margin="dense" size={"small"} fullWidth InputLabelProps={{ required: false }} {...fieldProps}>
            {kids} 
        </TextField>
    )
}