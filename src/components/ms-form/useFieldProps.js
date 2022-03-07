import { useCallback, useContext } from "react";
import FormWrapper from ".";
import standardObject from "../standard-object";
import { actions } from "./slice";

const params = "color defaultValue disabled error fullWidth helperText id InputLabelProps inputProps onBlur InputProps inputRef label margin minRows multiline name onChange placeholder required rows select SelectProps sx type value variant".split(" ")
const defaultValues = {fullWidth: true, margin: 'dense', variant: 'standard'}
const createFieldProps = standardObject(params)
export default function useFieldProps(id, props){
    const {selector, dispatch} = useContext(FormWrapper.Context)
    const store = selector(s => s)
    const field = selector(s => s.fields[id])
    const {beforeValidations, validateOnChange, validateOnBlur} = field
    const onChange = ({target}) => {
        let value = Object.values(beforeValidations).reduce((val, cb) => cb(val), target.value)
        dispatch(actions.updateFieldValue({id, value}))
        Object.values(validateOnChange).forEach(cb => cb(value, field, dispatch, store))
    }
    const onBlur = () => {
        const value = field.value
        Object.values(validateOnBlur).forEach(cb => cb(value, field, dispatch, store))
    }
    
    const obj = {
        id: `${id}-field`,
        name: id,
        value: selector(s => s.fields[id].value),
        onChange, 
        onBlur, 
        error: selector(s => s.fields[id].error),
        helperText: selector(s => s.fields[id].helperText),
        required: selector(s => s.fields[id].required),
        disabled: selector(s => s.fields[id].disabled),
        inputProps: {pattern: selector(s => s.fields[id].pattern), ...(props.inputProps || {})},
        placeholder: selector(s => s.fields[id].placeholder)
    }
    return createFieldProps(obj, {...defaultValues, ...props})
}