import { debounce } from "lodash";
import { createContext, useEffect, useReducer } from "react";
import log from "../log";
import reducer, {actions, initialState} from "./slice";

const Context = createContext()
export default function FormWrapper({children}){
    const [store, dispatch] = useReducer(reducer, initialState)
    const selector = (cb) => cb(store)
    const initialize = debounce(() =>{
        dispatch(actions.inializeForm())
    }, 100)

    return (
        <Context.Provider value={{dispatch, selector, initialize}}>
            {children}
        </Context.Provider>
    )
}
FormWrapper.Context = Context