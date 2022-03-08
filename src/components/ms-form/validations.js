// ====================
// Field Validations
// ====================
const emailTest = (string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(string)

export const emailValidation = (value) => {
    if(value.length === 0) return "Email is required"
    if(value.length >= 50) return "Email should be less than 50 characters long"
    if(!emailTest(value)) return "Email has an incorrect format"
}
export const passwordValidation = value => {
    if(value.length < 8) return "Password must be at least 8 characters long"
    if(value.length > 32) return "Password should be less than 32 characters"
    const hasLowerCase = /[a-z]+/.test(value)
    console.log({hasLowerCase})
    if(!hasLowerCase) return "Password should have as least one lowercase letter"
    const hasUpperCase = /([A-Z])+/.test(value)
    if(!hasUpperCase) return "Password should have at least one uppercase letter"
}
export const confirmationValidation = (value, field, store) => {
    if(value === "") return false 
    const password = store.fields.password.value
    if(value !== password) return "Passwords do not match"
}

// ====================
// Page One Validations
// ====================

export const pageFields = (fields) => (store) => {
    const pageErrors = fields.reduce((arr, field)=>{
        const hasError = store.fields[field]?.error === true
        hasError && arr.push(field)
        return arr 
    },[])
    const pageHasErrors = pageErrors.length > 0
    if(pageHasErrors) return pageErrors 
    return false 
}

export const requiredFields = fields => store => {
    const emptyFields = fields.reduce((arr, field)=>{
        const value = store.fields[field]?.value
        const isEmpty = !value || value === ""
        isEmpty && arr.push(field)
        return arr 
    },[])
    const pageFieldsAreEmpty = emptyFields.length > 0
    if(pageFieldsAreEmpty) return emptyFields 
    return false 
}

export const pageFieldValidators = fields => store => {
    const faildValidations = fields.reduce((obj, field)=>{
        const {validateOnBlur, validateOnChange, value} = store.fields[field] || {}
        const args = [value, store.fields[field], store]
        let messages = validateOnBlur.reduce((arr, cb)=> {
            const result = cb(...args)
            result && arr.push(result(...args))
            return arr 
        },[])
        messages = validateOnChange.reduce((arr, cb)=> {
            const result = cb(...args)
            result && arr.push(result(...args))
            return arr 
        },messages)
        const failed = messages.length > 0
        if(failed) obj[field] = messages 
        return obj 
    },{})
    const failed = Object.keys(faildValidations).length > 0
    if(failed) return faildValidations 
    return false 
}