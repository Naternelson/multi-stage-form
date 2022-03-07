import { useContext, useEffect, useState } from "react"
import FormWrapper from "."
import log from "../log"
import { actions } from "./slice"

export default function FormPage({children, validations}){
    const {selector, dispatch} = useContext(FormWrapper.Context)
    const [id, setId] = useState(null)
    const store = selector(s => s)
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
        
        validations && validations.forEach(cb => {
            const action = actions.validatePage({id, cb})
            dispatch(action)
        })
        
    },[])
    
    const {validations: vals} = selector(s => s.pages[id])
    const results = vals && vals.map(cb => cb(store))
    log(
        "Page Validations", 
        id ? `Page ID#${id}` : "Page not initialized", 
        `Num of Validations${vals.length || 0}`, 
        results
    )

    return <>
        {children}
    </>

}