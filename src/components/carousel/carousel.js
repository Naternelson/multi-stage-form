import { useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import CarouselWrapper from ".";

export default function Carousel({children, height}){
    const ctx = useContext(CarouselWrapper.Context)
    const ref = useRef(null)

    return <animated.div ref={ref} style={{height: "100vh", overflow: "hidden", willChange: 'min-height', position: 'relative'}}>
        {children}
    </animated.div>
}