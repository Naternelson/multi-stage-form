import { jsx } from "@emotion/react"
import { debounce } from "lodash"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import usePageNavigation from "../carousel/usePageNavigation"
import log from "../log"
import FormPage from "./page"
import { actions } from "./slice"
import FormWrapper from "./wrapper"

export function useFormSelector(cb, deps=[]){
    // ====================
    // Create a subscriber to a result from the store. React will only update if the result if the callback returns a different value
    // ====================
    const [result, setResult] = useState(null)
    const {store} = useContext(FormWrapper.Context) 
    useDeepEffect(()=>{
        setResult(cb(store))
    }, [store, ...deps])

    return result 
}



export function useFormDispatch(previousHistory) {
    // ====================
    // Return the dispatch function from the context provider and record the history of dispatches
    // ====================
    const history = useRef(previousHistory || [])
    const {dispatch, store} = useContext(FormWrapper.Context)
    const dispatcher = (action) => {
        const obj = {store, time: new Date().toLocaleString(), ...action}
        history.current.push(obj)
        dispatch(action)
    }
    return [dispatcher, history.current] 
}

export function useFormNavigation(){
    // ====================
    // Navigate the form and carousel
    // ====================
    const {navigate, navigateBack, navigateForward} = usePageNavigation({loop: false})
    const [dispatch] = useFormDispatch()
    const index = useFormSelector(s => s.form.index)
    return (to) => {
        let cb
        if((index + 1) === to) cb = navigateForward
        else if((index -1) ===to) cb = navigateBack
        else cb = navigate 
        cb(to)
        dispatch(actions.changePage(to))
    }
   
}

export function usePageId(){
    const id = useContext(FormPage.Context)
    const [thisId, setId] = useState()
    useEffect(()=>{
        setId(id)
    },[id])
    return thisId
}

export function useCurrentPage(){
    const index = useFormSelector(s => s.form.index)
    const page = useFormSelector(s => Object.values(s.pages).find(p => p.index === index), [index])
    return [page, index]
}

export function usePageValidation(id, validations){
    // ====================
    // Create page validations and run those validations on when the page fields change
    // The page will automatically detect when its fields have errors or when required fields are left blank
    // If the page is not active it will not run the validations
    // Custom validations should return an error message if their validations fail, otherwise should not return or return a falsy value.
    // When an error message is returned, the validations cease and the page is given a "ready" status of false
    // Page knows which fields are its own by the key 'pageId' of each field object
    // ====================
    const [dispatch] = useFormDispatch()
    const fields = useFormSelector(store => {
        return Object.values(store.fields).filter(field => field.pageId === id)
    }, [id])
    const index = useFormSelector(s => s.form.index)
    const pageIndex = useFormSelector(s => s.pages[id]?.index, [id])
    const pageReady = useFormSelector(store => store.pages[id]?.ready,[id])


    useEffect(()=>{
        if(!id) return 
        validations?.forEach(cb => dispatch(actions.validatePage({id, cb})))
    }, [id])

    useDeepEffect(()=>{
        if(!id) return
        if(fields.length === 0) return 
        if(index !== pageIndex) return 
        const logger = (...messages) => log(`Page ID:${id} Validations...`, messages, ...(fields|| []).map(field => ({name: field.id, value: field.value})) )
        const setPageStatus = bool => () => dispatch(actions.setPageStatus({id, ready: bool}))
        const pageNotReady = setPageStatus(false)
        const pageReady = setPageStatus(true)

        const hasErrors = fields?.some(field => field.error)
        hasErrors && logger("Has Errors")
        if(hasErrors) return pageNotReady() 
        
        const hasBlanks = fields?.some(field =>  {
            if(field.required) return  !field.value || field.value === ""})
        hasBlanks && logger("Has Blanks")
        if(hasBlanks) return pageNotReady()

        const failedTests = validations?.some(v => v(fields))
        failedTests && console.log("Failed Vals", fields)
        if(failedTests) return pageNotReady()
        logger("Page is ready")
        return pageReady()

    }, [id, index, pageIndex, fields])

    return pageReady
}

export function useFieldValidation(id, props, options){
    // ====================
    // Setup a new field in the store and return props to use
    // ====================
    const {onChangeValidations, onBlurValidations} = props 
    const [dispatch] = useFormDispatch()
    const pageId = usePageId()
    const store = useFormSelector(s => s)
    const field = useFormSelector(s => s.fields[id], [id])
    const {validateOnChange, validateOnBlur} = field || {}
    const setValue = (val) => dispatch(actions.updateFieldValue({id, value:val}))
    const setError = message => dispatch(actions.newFieldError({id, message}))
    const clearError = () => dispatch(actions.clearFieldError(id))
    useEffect(()=>{

        if(!pageId) return 
        dispatch(actions.createField({id, value: "", pageId, ...props}))
        onChangeValidations?.forEach(cb => dispatch(actions.validateFieldOnChange({id, cb})))
        onBlurValidations?.forEach(cb => dispatch(actions.validateFieldOnBlur({id, cb})))
    },[pageId])



    const onBlur = () => {
        validateOnBlur?.some(cb => {
            const message = cb(field.value, field, store)
            message && setError(message)
            return !!message
        })
    }

    const onFocus =() =>{
        clearError()
    }

    const onChange = (e) => {
        const value = e.target.value
        setValue(value)
        const hasError = validateOnChange?.some(cb => {
            const message = cb(value, field, store)
            message && setError(message)
            return !!message
        })
        !hasError && clearError()
        
    }
    const object = {value: "", ...props, ...field, onBlur, onChange, onFocus, id: `${id}-field`}
    const blackListed = "pageId validateOnBlur beforeValidations validateOnChange onChangeValidations onBlurValidations".split(/\s+/)
    blackListed.forEach(t => delete object[t])
    return [object, field]
}

export function useDeepEffect(cb, dep){
    const newDeps = dep?.map(d => JSON.stringify(d))
    useEffect(cb, newDeps)
}