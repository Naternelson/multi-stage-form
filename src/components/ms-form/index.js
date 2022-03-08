import { createContext, useEffect, useReducer } from "react";
import log from "../log";
import reducer, {initialState} from "./slice";

const Context = createContext()
export default function FormWrapper({children}){
    const [store, dispatch] = useReducer(reducer, initialState)
    const selector = (cb) => cb(store)

    useEffect(()=>{
        log("Form Initialized")
    },[])
    

    return (
        <Context.Provider value={{dispatch, selector}}>
            {children}
        </Context.Provider>
    )
}
FormWrapper.Context = Context