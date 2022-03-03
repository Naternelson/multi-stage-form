import { Box } from "@mui/material";
import { createContext, useState } from "react";
import { useSpring, animated, to } from 'react-spring'

const Context = createContext()

export default function Carousel(props){
    const [page, setPage] = useState(props.page || 0)
    const [height, setHeight] = useState(props.height || 0)
    const [totalPages, setTotal] = useState(0)
    const parent = useRef(null)
    const store = {
        page: {value: page, set: setPage}, 
        total: {value: totalPages, set: setTotal},
        height: {value: height, set: setHeight},
        get parent(){
            return parent?.current
        }
    }

    const heightProps = useSpring({
        to: {height}
    })
    const AnimatedBox = animated(({children}) => (
        <Box {...props} sx={{position: 'relative', ...(props.sx || {})}} ref={parent}>
            {children}
        </Box>
    ))

    

    return (
        <Context.Provider value={store}>
            <AnimatedBox style={{...heightProps}}>
                {props.children}
            </AnimatedBox>
        </Context.Provider>
    )
}


Carousel.Context = Context