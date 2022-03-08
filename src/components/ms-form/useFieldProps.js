import { startCase } from "lodash";
import { useContext, useEffect } from "react";
import FormWrapper from ".";
import log from "../log";
import standardObject from "../standard-object";
import { actions } from "./slice";

const params = "color defaultValue disabled error fullWidth helperText id InputLabelProps inputProps onBlur onFocus InputProps inputRef label margin minRows multiline name onChange placeholder required rows select SelectProps sx type value variant".split(" ")
const defaultValues = {fullWidth: true, margin: 'dense', variant: 'standard', error: true}
const createFieldProps = standardObject(params)
export default function useFieldProps(id, props){

    
    const {selector, dispatch} = useContext(FormWrapper.Context)
    const store = selector(s => s)
    const field = selector(s => s.fields[id])
    const {beforeValidations, validateOnChange, validateOnBlur} = field || {}

    const onChange = (e) => {
        const target = e.target 
        let value = Object.entries(beforeValidations || {}).reduce((val, [name,cb]) => cb(val, name), target.value)
        dispatch(actions.updateFieldValue({id, value}))
        const cb = Object.values(validateOnChange).find(cb => cb(value, field, store))
        const error = cb && cb(value,field,store)
        error && dispatch(actions.newFieldError({id, message: error}))
        !error && dispatch(actions.clearFieldError(id))
    }
    const onBlur = () => {
        const value = field.value
        if(field.error) return 
        const cb = Object.values(validateOnBlur).find(cb => cb(value, field, store))
        const error = cb && cb(value,field,store)
        error && dispatch(actions.newFieldError({id, message: error}))
        !error && dispatch(actions.clearFieldError(id))
    }
    const onFocus = () => {
        dispatch(actions.clearFieldError(id))
    }
    const obj = {
        id: `${id}-field`,
        name: id,
        label: props?.label || startCase(id),
        value: selector(s => s.fields[id]?.value) || "",
        onChange, 
        onBlur, 
        onFocus,
        error: selector(s => s.fields[id]?.error),
        helperText: selector(s => s.fields[id]?.helperText),
        required: selector(s => s.fields[id]?.required),
        disabled: selector(s => s.fields[id]?.disabled),
        inputProps: {pattern: selector(s => s.fields[id]?.pattern), ...(props?.inputProps || {})},
        placeholder: selector(s => s.fields[id]?.placeholder)
    }

    useEffect(()=>{
        // log(`Initializing Field ${id}`)
        dispatch(actions.createField({id, ...props}))
    },[])

    return createFieldProps(obj, {...defaultValues, ...props})
}