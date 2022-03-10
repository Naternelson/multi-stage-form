import React, { useContext, useMemo } from "react"
import FormWrapper from "."
import { actions } from "./slice"

export default function useFormValidation(){
    const ctx = useContext(FormWrapper.Context)
    const store = ctx.selector(s => s)
    const {pages, fields, form} = store
    const index = form.index 
    const page = Object.values(pages).find(page => page.index === index)
    const pageId = page?.id
    const pageStatus = pages[pageId]?.ready 
    const pageFields = Object.values(fields).filter(field => field.pageId === pageId)
    

    if(!form.initialized) return 
    console.log("Calling validation", pageId)
    
    const hasErrors = pageFields.some(field => field.error)
    if(hasErrors && !pageStatus) return 
    if(hasErrors) return ctx.dispatch(actions.setPageStatus({id: pageId, ready: false}))
    console.log("No errors")
    const hasBlanks = pageFields.some(field => field.required && (!field.value || field.value === ""))
    if(hasBlanks && !pageStatus) return 
    if(hasBlanks) return ctx.dispatch(actions.setPageStatus({id: pageId, ready: false}))
    console.log("No blanks")

    const cbs = page.validations || []
    for(let i=0; i<cbs.length; i++){
        const failedValidation = !!cbs[i](store)
        if(failedValidation && !pageStatus) return 
        if(failedValidation) return ctx.dispatch(actions.setPageStatus({id: pageId, ready: false}))
    }
    console.log("No failed validations")
    if(!pageStatus)  return ctx.dispatch(actions.setPageStatus({id: pageId, ready:true}))

    const formReady = Object.keys(pages).every(page => page.ready)
    if(form.ready === formReady) return 
    return ctx.dispatch(actions.formReady())

}