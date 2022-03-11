import { Box } from "@mui/material"
import FormWrapper from "./wrapper"

export default function FormWithPages({children, sx}){
    const onSubmit = e => e.preventDefault()
    return <FormWrapper>
            <Box as={"form"}onSubmit={onSubmit} sx={{width: "100%", height: "100%"}}>
                {children}
            </Box>
        </FormWrapper>
}