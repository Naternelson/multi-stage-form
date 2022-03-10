import FormWrapper from "./wrapper"

export default function FormWithPages({children}){
    const onSubmit = e => e.preventDefault()
    return <FormWrapper>
            <form onSubmit={onSubmit}>
                {children}
            </form>
        </FormWrapper>
}