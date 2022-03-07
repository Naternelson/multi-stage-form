import { createContext, useReducer } from "react";
import reducer, {initialState} from "./slice";

const Context = createContext({children})
export default function FormWrapper(){
    const [store, dispatch] = useReducer(reducer, initialState)
    const selector = (cb) => cb(store)
    return (
        <Context.Provider value={{dispatch, selector}}>
            {children}
        </Context.Provider>
    )
}
FormWrapper.Context = Context