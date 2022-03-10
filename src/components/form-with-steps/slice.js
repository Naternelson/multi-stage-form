import log from "../log"
import standardObject from "../standard-object"
const isBool = obj => obj === true || obj === false 
const getBool = (obj, defaultValue = true) => isBool(obj) ? obj : defaultValue
const isUndefined = obj => obj === undefined
const isDefined = obj => !isUndefined(obj)

const fieldParams = "id name error pageId helperText type required value disabled pattern placeholder beforeValidations validateOnChange validateOnBlur".split(" ")
const fieldObj = standardObject(fieldParams)

const slice = {
    name: "form",
    initialState: {
        fields: {},
        pages: {},
        form: {
            index: 1,
            ready: false,
            submitted: false,
            initialized: false 
        },
        
    },
    reducers: {
        inializeForm: (store) => {
            store.form.initialized = true 
            return store 
        },
        createField: (store, action) => {
            const {id} = action.payload 
            
            store.fields[id] = fieldObj(action.payload, {
                helperText: "", error: false, value: "", 
                validateOnBlur: [], validateOnChange: [], beforeValidations: []
            })
            return store
        },
        deleteField: (store, action) => {
            delete store[action.payload]
            return store
        },
        updateFieldValue: (store, action) => {
            const {id, value} = action.payload 
            store.fields[id].value = value || "" 
            return store 
        },
        updateField: (store, action) => {
            const {id} = action.payload
            const obj = store.fields[id]
            const fObj = fieldObj(action.payload, obj)
            store.fields[id] = fObj
            return store 
        },
        clearFieldError: (store, action)=>{
            store.fields[action.payload].error = false 
            store.fields[action.payload].helperText = null 
            return store
        },
        newFieldError: (store, action) => {
                const {id, message} = action.payload
            store.fields[id].error = true 
            store.fields[id].helperText = message
            return store
        },
        beforeFieldValidation: (store, action) => {
            const {id, cb} = action.payload 
            store.fields[id].beforeValidations.push(cb)
            return store 
        },
        validateFieldOnChange: (store, action) => {
            const {id, cb} = action.payload 
            store.fields[id].validateOnChange.push(cb)
            return store
        },
        validateFieldOnBlur: (store, action) => {
            const {id, cb} = action.payload 
            store.fields[id].validateOnBlur.push(cb)
            return store 
        },
        createPage: (store, action) => {
            const {id, index, ready} = action.payload 
            store.pages[id] = {
                id, index, ready: getBool(ready),
                validations: []
            }
            return store 
        },
        deletePage: (store, action) => {
            delete store.pages[action.payload]
            return store 
        },
        validatePage: (store, action) => {
            const {id, cb} = action.payload
            store.pages[id].validations.push(cb)
            return store
        },
        changePage: (store, action)=>{
            store.form.index = action.payload
            return store
        },
        setPageStatus: (store, action) => {
            const pageAvailable = store.pages[action.payload.id]
            if(!!pageAvailable) store.pages[action.payload.id].ready = !!action.payload.ready 
            if(!!action.payload.ready) store.form.ready = false 
            return store 
        },
        formReady: store => {
            store.form.ready = true
        }, 
        submitForm: (store) => {
            store.form.submitted = true 
            return store
        },
        unsubmitForm: (store) => {
            store.form.submitted = false
            return store 
        }
    }
}

const actionMap = Object.keys(slice.reducers).map(key => {
    const type = slice.name + "/" + key
    const actionCreator =  (payload) => {
        return {type, payload}
    }
    actionCreator.type = type 
    return {key, actionCreator, type, reducer: slice.reducers[key]}
})

export const actions = actionMap.reduce((obj, a)=> {
    obj[a.key] = a.actionCreator
    return obj 
},{})
const reducer = (store, action) =>{
    const actionReducer = actionMap.find(a => a.type == action.type)
    if(actionReducer.reducer) return {...actionReducer.reducer(store, action)}
    else throw new Error("No reducer found for action, ", action)
}
export default reducer 
export const initialState = slice.initialState