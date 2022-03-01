import { Box, InputAdornment, TextField } from "@mui/material"
import { startCase } from "lodash"

export default function FormField(props){
    const sx = {mb: 2, ...(props.sx || {})}
    const id = props.id + "-input"
    const size = "small"
    const textSx = {fontSize: 14}
    const endAdornment = props.children && <InputAdornment position="end">{props.children}</InputAdornment>
    const label = props.label || startCase(props.id)
    const InputLabelProps = {
        ...(props.InputLabelProps || {}), 
        sx: {...textSx, ...(props.InputLabelProps?.sx || {})}
    }
    const InputProps = {
        ...(props.InputProps || {}),
        sx: {...textSx, ...(props.InputProps?.sx || {})},
        endAdornment
    }
    const passProps = {...props, sx, id, size, fullWidth: true, label, InputLabelProps, InputProps, helperText: props.error || null, error: !!props.error}
    return (
        <TextField {...passProps}/>
    )
        

}