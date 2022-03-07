import standardObject from "../standard-object"
const isBool = obj => obj === true || obj === false 
const getBool = (obj, defaultValue = true) => isBool(obj) ? obj : defaultValue
const isUndefined = obj => obj === undefined
const isDefined = obj => !isUndefined(obj)

const fieldParams = "id name error helperText type required value disabled pattern placeholder beforeValidations validateOnChange validateOnBlur".split(" ")
const fieldObj = standardObject(fieldParams)

const slice = {
    name: "form",
    initialState: {
        fields: {},
        pages: {},
        form: {
            index: 0,
        }
    },
    reducers: {
        createField: (store, {payload}) => {
            store.fields[id] = fieldObj(payload, {validateOnBlur: {}, validateOnChange: {}})
            return store
        },
        deleteField: (store, {payload}) => {
            delete store[payload]
            return store
        },
        updateFieldValue: (store, {payload}) => {
            const {id, value} = payload 
            store.fields[id] = value 
            return store 
        },
        updateField: (store, {payload}) => {
            const {id} = payload
            const obj = store.fields[id]
            const fObj = fieldObj(payload, obj)
            store.fields[id] = fObj
            return store 
        },
        clearFieldError: (store, {payload})=>{
            store.fields[payload].error = false 
            return store
        },
        newFieldError: (store, {payload}) => {
            const {id, message} = payload
            store.fields[id].error = true 
            store.fields[id].helperText = message || ""
            return store
        },
        beforeFieldValidation: (store, {payload}) => {
            const {id, cb} = payload 
            store.fields[id].beforeValidations.push(cb)
            return store 
        },
        validateFieldOnChange: (store, {payload}) => {
            const {id, cb} = payload 
            store.fields[id].validateOnChange.push(cb)
            return store
        },
        validateFieldOnBlur: (store, {payload}) => {
            const {id, cb} = payload 
            store.fields[id].validateOnBlur.push(cb)
            return store 
        },
        createPage: (store, {payload}) => {
            const {id, index, ready} = payload 
            store.pages[id] = {
                id, index, ready: getBool(ready),
                validations: []
            }
            return store 
        },
        deletePage: (store, {payload}) => {
            delete store.pages[payload]
            return store 
        },
        validatePage: (store, {payload}) => {
            const {id, cb} = payload
            store.pages[id].validations.push(cb)
            return store
        } 
    }
}

const actionMap = Object.keys(slice.reducers).map(key => {
    const type = slice.name + "/" + key
    const fn =  (payload) => {
        return {type, payload}
    }
    fn.type = type 
    return {key, actionCreator: fn, type, reducer: slice.reducers[key]}
})

export const actions = actionMap.reduce((obj, a)=> {
    obj[a.key] = a.reducer
    return obj 
},{})

export default reducer = (store, action) =>{
    const actionReducer = actionMap.find(a => a.type == action.type)
    if(actionReducer.reducer) return {...actionReducer.reducer(store, action)}
    else throw new Error("No reducer found for action, ", action)
}

export const initialState = slice.initialState