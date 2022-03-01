import { createContext, useReducer } from "react"

export const FormContext = createContext()
export const preventDefault = e => e.preventDefault()
export const FormInitialState = {fields: {}, errors: {}, currentPage: 0, steps: 0}

export function actionCreator(name){
    const fn = (payload) => ({type: name, payload})
    fn.type = name 
    return fn 
}

export const formActionCreator = (name) => actionCreator(`form/${name}`) 

export const updateField   =  formActionCreator("updateField")
export const updateError   =  formActionCreator("updateError")
export const next          =  formActionCreator("nextPage")
export const back          =  formActionCreator("backPage")
export const restart       =  formActionCreator("restart")
export const reset         =  formActionCreator("reset")

export const fieldsReducer  =  (fields, action) => {
    fields[action.payload.name] = action.payload.value 
    return fields
}
export const errorReducer  =  (errors, action)  => {
    const {value, name} = action.payload
    const hasError = value 
    hasError && (errors[name] = value)
    !hasError && delete errors[name]
    return errors 
}

export const nextReducer   =  (state, action) => {
    const {currentPage, steps} = state 
    if(currentPage < steps) state.currentPage = currentPage + 1
    if(typeof action.payload === "number") state.currentPage = action.payload 
    return state 
}

export const backReducer   =  (state, action) => {
    const {currentPage} = state 
    if(currentPage > 0) state.currentPage = currentPage - 1
    if(typeof action.payload === "number") state.currentPage = action.payload 
    return state 
}

export const restartReducer = (state) => {
    state.currentPage = 0
    return state 
}

export const resetReducer = (state) => {
    return {...FormInitialState, steps: state.steps}
}

export function formReducer(state, action){
    switch(action.type){
        case resetReducer.type:
            return resetReducer(state, action)
        case restartReducer.type: 
            return restartReducer(state, action)
        case backReducer.type: 
            return backReducer(state, action)
        case nextReducer.type: 
            return nextReducer(state, action)
        case errorReducer.type: 
            return {...state, errors: errorReducer(state.errors, action)}
        case fieldsReducer.type: 
            return {...state, fields: fieldsReducer(state.fields, action)}
        default: 
            throw new Error(`No reducers match action type of: ${action.type}`)
    }
} 


export default function MultiStageForm(props){
    const initialState = {...FormInitialState, steps: props.steps || 0}
    const [state, dispatch] = useReducer(formReducer, initialState)
    const selector = cb => cb(state)
    return (
        <FormContext.Provider value={{dispatch, state, selector}}>
            {props.children}
        </FormContext.Provider>

    )
}
