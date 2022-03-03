import { Slide } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useEffect, useState } from "react";
import Carousel from ".";
import { useSpring, animated } from 'react-spring'

export default function CarouselPage(props){
    const {page, total, parent} = useContext(Carousel.Context)
    const [pageId, setPageId] = useState(null)
    
    useEffect(()=>{
        // ====================
        // Add page to count
        // ====================
        total.set(current => current + 1)
        setPageId(total.value)
        return ()=> total.set(current => current - 1)
    },[])

    const [styles, api] = useSpring(() => {
        x: 0
    })
    return (
        <animated.div style={{...style, position: 'absolute', y: 0}}>
            {props.children}
        </animated.div>
    )
}