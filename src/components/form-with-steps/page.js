import { createContext, useEffect, useState } from "react";
import log from "../log";
import { useCurrentPage, useFormDispatch, useFormSelector, usePageValidation } from "./hooks";
import { actions } from "./slice";

const Context = createContext()
export default function FormPage({index, children}){
    const [id, setId] = useState(null)
    const [dispatch] = useFormDispatch()
    const [currentPage] = useCurrentPage()
    const [show, setShow] = useState(false)
    const numOfPages = useFormSelector(s => Object.values(s.pages).length)
    usePageValidation(id)
    useEffect(()=>{
        if(numOfPages === null || numOfPages === undefined ) return 
        if(!!id) return 
        const newId = new Date().valueOf()
        setId(newId)
        dispatch(actions.createPage({id: newId, index: index || numOfPages, ready: false}))
        log("Complete Page Level", `ID - ${newId}`)
    },[index, numOfPages])

    useEffect(()=>{
        if(currentPage?.id === id) setShow(true)
        else setShow(false)
    },[currentPage?.id])

    return (
        <Context.Provider value={id}>
            <div style={{display: show ? 'block' : 'none' }}>
                {children}
            </div>
        </Context.Provider>
    )
}
FormPage.Context = Context