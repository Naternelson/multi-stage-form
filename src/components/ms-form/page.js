import { CheckBoxTwoTone } from "@mui/icons-material"
import { isEqual } from "lodash"
import { useContext, useEffect, useRef, useState } from "react"
import FormWrapper from "."
import log from "../log"
import { actions } from "./slice"

export default function FormPage({children, validations, idSetter}){
    const {selector, dispatch, initialize} = useContext(FormWrapper.Context)
    const [id, setId] = useState(null)
    const currentIndex = selector(s => s.form.index)
    const index = selector(s => s.pages[id]?.index)
    // const fields = selector(s => s.fields)

    const pages = selector(s => s.pages)
    const active = currentIndex === index 
    useEffect(()=>{
        // ====================
        // Setup Page
        // ====================
        const createPage = () => {
            const id = new Date().valueOf()
            const index = Object.keys(pages).length
            const ready = false
            const action = actions.createPage({id, index, ready})
    
            dispatch(action)
            setId(id)
            if(idSetter) idSetter(id)
            
            validations && validations.forEach(cb => {
                const action = actions.validatePage({id, cb})
                dispatch(action)
            })   
            initialize()         
        }
        setTimeout(createPage,0)

    },[])
    

    useEffect(()=>{
        // ====================
        // Validations
        // ====================
        // if(active){
        //     const fieldChange = !isEqual(values, valueRef.current)
        //     if(fieldChange){
        //         const {validations: vals} = selector(s => s.pages[id] || {})
        //         const results = vals && vals.find(cb => cb(store))
        //         dispatch(actions.setPageStatus({id, ready: !results}))
        //         index >= 0 && log(
        //             `Page Validations ${index}`, 
        //             `Page ID#${id}`, 
        //             `Num of Validations: ${vals?.length || 0}`, 
        //             results && results(store)
        //         )
        //     }
        //     valueRef.current = values 
        // }

    })

    const spanProps = active ? {} : {style: {display: 'none'}}
    return <span {...spanProps}>
        {children}
    </span >

}