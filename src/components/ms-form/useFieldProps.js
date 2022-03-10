import { before, startCase } from "lodash";
import { useCallback, useContext, useEffect } from "react";
import FormWrapper from ".";
import standardObject from "../standard-object";
import { actions } from "./slice";

const params = "color defaultValue disabled error fullWidth helperText id InputLabelProps inputProps onBlur onFocus InputProps inputRef label margin minRows multiline name onChange placeholder required rows select SelectProps sx type value variant".split(" ")
const defaultValues = {fullWidth: true, margin: 'dense', variant: 'standard', error: true}
const createFieldProps = standardObject(params)
export default function useFieldProps(id, props){
    
    
    const {selector, dispatch, initialize} = useContext(FormWrapper.Context)

    const store = selector(s => s)
    const field = selector(s => s.fields[id]) || {}
    const {beforeValidations, validateOnChange, validateOnBlur} = field || {}


    const onChange = useCallback((e)=>{
        const target = e.target 
        let value = Object.entries(beforeValidations || {}).reduce((val, [name,cb]) => cb(val, name), target.value)
        dispatch(actions.updateFieldValue({id, value}))
        const cb = Object.values(validateOnChange).find(cb => cb(value, field, store))
        const error = cb && cb(value,field,store)
        error && dispatch(actions.newFieldError({id, message: error}))
        !error && dispatch(actions.clearFieldError(id))
    }, [beforeValidations?.length, dispatch, validateOnChange?.length, field.id, actions.newFieldError, actions.clearFieldError])


    const onBlur = useCallback(()=> {
        const value = field.value
        if(field.error) return 
        const cb = Object.values(validateOnBlur).find(cb => cb(value, field, store))
        const error = cb && cb(value,field,store)
        error && dispatch(actions.newFieldError({id, message: error}))
        !error && dispatch(actions.clearFieldError(id))
    },[validateOnBlur?.length, field.id, dispatch, actions.newFieldError, actions.clearFieldError])

    const onFocus = () => {
        dispatch(actions.clearFieldError(id))
    }

    const obj = {
        id: `${id}-field`,
        name: id,
        label: props?.label || startCase(field.label || field.id) ,
        value: field.value || "",
        onChange, 
        onBlur, 
        onFocus,
        error: field.error,
        helperText: field.helpertText,
        required: field.required,
        disabled: field.disabled,
        placeholder: field.placeholder
    }


    useEffect(()=>{
        dispatch(actions.createField({id, ...props}))



        initialize()
    },[])

    return createFieldProps(obj, {...defaultValues, ...props})
}