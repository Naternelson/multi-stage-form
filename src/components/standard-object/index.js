const standardObject = params => (obj, defaultObject) => {
    return params.reduce((newObj, param) => {
        if(param in obj) newObj[param] = obj[param]
        return newObj
    }, defaultObject || {})
}

export default standardObject