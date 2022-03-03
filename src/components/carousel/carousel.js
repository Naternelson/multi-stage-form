import { useContext, useState } from "react";
import { animated, useSpring } from "react-spring";
import CarouselWrapper from ".";

export default function Carousel({children}){
    const ctx = useContext(CarouselWrapper.Context)
    
    const style = useSpring({to: {height: ctx.height}, delay: 100})
    return <animated.div style={{...style, overflow: "hidden", willChange: 'height', position: 'relative'}}>
        {children}
    </animated.div>
}