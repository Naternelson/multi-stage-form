import { useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import CarouselWrapper from ".";

export default function Carousel({children}){
    const ctx = useContext(CarouselWrapper.Context)
    const ref = useRef(null)
    const [height, setHeight] = useState(0)
    const style = useSpring({to:{height}, config: ctx.default})

    useEffect(()=>{
        const timer = setTimeout(()=>setHeight(ctx.height),0)
        return () => clearTimeout(timer)
    },[ctx.height])
    return <animated.div ref={ref} style={{...style, overflow: "hidden", willChange: 'height', position: 'relative'}}>
        {children}
    </animated.div>
}