import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTransition, useSpringRef, animated, useSpring, config } from "react-spring";
import usePrevious from "../usePrevious";

export default function Example(){

    return (
        <Paper elevation={3} sx={{mx: 'auto', maxWidth: 500, my: 5}}>
            <Box sx={{userSelect: 'none'}}>Hello Moto</Box>
            <Carousel>
                <CarouselPage p={2}>
                    <Box sx={{display: "flex", flexDirection: 'row', justifyContent: 'space-around'}}>
                        <Box>
                            Hello there
                        </Box>
                        <Box>
                            Goodbye There
                        </Box>
                    </Box>
                </CarouselPage>
                <CarouselPage  p={2}>
                    <Box>
                        Hiya
                    </Box>
                    <Box>
                        LOL
                    </Box>
                </CarouselPage>
                <CarouselPage p={5} minHeight={"200px"}>
                    <Box>
                        saldfkjasdlf;j
                    </Box>
                    <Box>
                        LOL
                    </Box>
                </CarouselPage>
            </Carousel>

        </Paper>
    )
}


const Context = createContext()
export function Carousel(props){
    const [index, setIndex] = useState(0)
    const [height, setHeight] = useState(0)
    const [direction, setDirection] = useState(1)
    const pages = useRef([])
    const ready = useRef(true)

    const value = {
        get index(){
            return index
        },
        set index(obj) {
            setIndex(obj)
        },
        get height(){
            return height 
        },
        set height(obj){
            setHeight(obj)
        },
        get pages(){
            return pages.current
        },
        set pages(obj){
            pages.current = obj
        },
        get direction(){
            return direction
        },
        set direction(num) {
            setDirection(num)
        },
        get ready(){
            return !!ready.current
        }, 
        set ready(bool){
            ready.current = !!bool
        }
    }

    const style = useSpring({
        height
    })

    const forward = () => ready.current && setIndex((current) => {
        return (current + 1) < value.pages.length ? current + 1 : 0
    })
    const backward = () => ready.current && setIndex((current) => (current) > 0 ? current - 1 : value.pages.length -1)


    return (
        <Context.Provider value={value}>
            <animated.div style={{...style, overflow: "hidden", display: 'flex', willChange: 'transform', position: 'relative'}}> 
                {props.children}
            </animated.div>
            <ButtonGroup fullWidth>
                <Button onClick={() => {
                    setDirection(-1)
                    setTimeout(backward, 0)
                }}>
                    Back
                </Button>
                <Button onClick={() => {
                    setDirection(1)
                    setTimeout(forward,0)
                }}>
                    Forward
                </Button>
            </ButtonGroup>
            
        </Context.Provider>
        
    )
}

Carousel.Context = Context

export function CarouselPage({children, ...props}){
    const transRef = useSpringRef()
    const AnimatedBox = animated(Box)
    const [pageId, setPage] = useState(null)
    const boxRef = useRef(null)
    const [transObj, setTransObj] = useState({})
    const ctx = useContext(Carousel.Context)
    const previousId = usePrevious(pageId)
    const standard = {
        ref: transRef,
        keys: null, 
        key: pageId, 
        enter: [{transform: 'translate3d(0%,0,0)', opacity: "100%"}, {userSelect: 'auto'}],
        onStart: () => ctx.ready = false,
        onRest: () => ctx.ready = true 
    }
    const entering = {
        from : {transform: 'translate3d(100%,0,0)', opacity: "0%", userSelect: 'none' },
        leave: {transform: 'translate3d(-100%,0,0)', opacity: "0%", userSelect: 'none' },
    }
    const returning = {
        from : {transform: 'translate3d(-100%,0,0)',opacity: "0%", userSelect: 'none' },
        leave: {transform: 'translate3d(100%,0,0)',opacity: "0%", userSelect: 'none' },
    }

    let obj = standard 
    if(ctx.direction) obj = {...obj, ...entering}
    else obj = {...obj, ...returning}
    const transitions = useTransition(ctx.index, transObj)

    useEffect(()=>{
        transRef.start()
        return () => transRef.stop()
    },[ctx.index])

    useEffect(()=> {
        let obj = standard 
        if(ctx.direction > 0) obj = {...obj, ...entering}
        else obj = {...obj, ...returning}
        setTransObj(obj)
    }, [ctx.direction])

    useEffect(()=>{
        if(previousId) setPage(previousId)
        if(!pageId & !previousId) {
            const id = ctx.pages.length
            setPage(id)
            ctx.pages = [...ctx.pages, id]
        }
        return () => {ctx.pages = ctx.pages.splice(pageId, 1)}
    }, [])


    useEffect(()=>{
        
        if(pageId === ctx.index) {
            ctx.height = boxRef.current.clientHeight
        }
    }, [pageId, ctx.index])


    return transitions((style, item) => (
        (item === pageId) && <AnimatedBox ref={boxRef} style={{...style, position: 'absolute', width: '100%'}}>
            <Box {...props}>
                {children}
            </Box>
        </AnimatedBox>
    ))
}