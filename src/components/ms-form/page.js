import { isEqual } from "lodash"
import { useContext, useEffect, useRef, useState } from "react"
import FormWrapper from "."
import log from "../log"
import { actions } from "./slice"

export default function FormPage({children, validations, idSetter}){
    const {selector, dispatch} = useContext(FormWrapper.Context)
    const [id, setId] = useState(null)
    
    const store = selector(s => s)
    const index = selector(s => s.pages[id]?.index)
    const fields = selector(s => s.fields)
    const valueRef = useRef([])
    const values = Object.values(fields).map(f => f.value)
    useEffect(()=>{
        // ====================
        // Setup Page
        // ====================
        
        const id = new Date().valueOf()
        const index = Object.values(selector(s => s.pages)).reduce((max, page) => {
            return page.index > max ? page.index : max },-1) + 1 
        const ready = false
        const action = actions.createPage({id, index, ready})

        dispatch(action)
        setId(id)
        if(idSetter) setTimeout(() => idSetter(id),0)
        
        validations && validations.forEach(cb => {
            const action = actions.validatePage({id, cb})
            dispatch(action)
        })
    },[])
    

    useEffect(()=>{
        const fieldChange = !isEqual(values, valueRef.current)
        if(fieldChange){
            const {validations: vals} = selector(s => s.pages[id] || {})
            const results = vals && vals.find(cb => cb(store))
            dispatch(actions.setPageStatus({id, ready: !results}))
            index >= 0 && log(
                `Page Validations ${index}`, 
                `Page ID#${id}`, 
                `Num of Validations: ${vals?.length || 0}`, 
                results && results(store)
            )
        }
        valueRef.current = values 
    })

        
    return <>
        {children}
    </>

}