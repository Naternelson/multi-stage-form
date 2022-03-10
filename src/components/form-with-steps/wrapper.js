import { createContext, useEffect, useReducer } from "react";
import CarouselWrapper from "../carousel";
import log from "../log";
import reducer, { initialState as defaultState } from "./slice";

const Context = createContext()
export default function FormWrapper(props){
    const [store, dispatch] = useReducer(reducer, props.initialState || defaultState)
    useEffect(()=>{
        log("Complete Form Layer", store)
    },[])
    return (
        <CarouselWrapper>
            <Context.Provider value={{store, dispatch}}>
                {props.children}
            </Context.Provider> 
        </CarouselWrapper>
    )
}

FormWrapper.Context = Context