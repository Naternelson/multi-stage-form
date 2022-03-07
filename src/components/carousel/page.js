import { Box } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import { animated, useSpringRef, useTransition } from "react-spring"
import CarouselWrapper from "."





export default function CarouselPage({children}){
    // ====================
    // pageId state

    // This state identifies this node to the `carousel`
    // If this state matches the index of the Carousel, this node will transition in

    // transObj state
    // this state outlines the transition to react-spring

    // transRef Ref
    // a reference to be utilized by react-spring

    // ctx Context
    // Context object pulled from the Carousel Provider
    // This context includes values for the:
    //      parent index, height, sibilings, transition direction, and ready state

    // Animated Box
    // react-spring modified or the MUI Box component
    // This component can accept transition style

    // boxRef Ref
    // A Reference to the rendered AnimatedBox component
    // Used to set the height of the parent compoenent, based off the height of this node

    // transitions obj
    // the object used to return the transisitons necessary for this component
    // ====================
    
    const [pageId, setPage] = useState(null)
    const [transObj, setTransObj] = useState(null)
    const transRef = useSpringRef()
    const ctx = useContext(CarouselWrapper.Context)
    const AnimatedBox = animated(Box)
    const boxRef = useRef(null)

    const transitionObject = (direction) =>({
        ref: transRef,
        keys: null, 
        enter: [{transform: 'translate3d(0%,0,0)'}, {userSelect: 'auto'}],
        from : {transform:  `translate3d(${Math.sign(direction)*100}%,0,0)`, userSelect: 'none' },
        leave: {transform: `translate3d(${Math.sign(direction)*-100}%,0,0)`, userSelect: 'none' },
        onStart: () => ctx.ready = false,
        onRest: () => ctx.ready = true,
        config: ctx.config
    })



    const transitions = useTransition(ctx.index, transObj || transitionObject(ctx.direction))
    
    useEffect(()=>{
        // ====================
        // A Spring effect, to initialize the transition
        // ====================
        transRef.start()
        // transRef.start()
        return transRef.stop
    },[ctx.index])

    useEffect(()=> {
        // ====================
        // Transition Object Initializiation
        //
        // Set up for the transition of this node
        // if direction is positive, the node will transition from right to left
        // if direction is negative, the node witll transition from left to right
        //
        // To prevent adverse side effects, the node is unselectable until the transition is complete
        // ====================
        setTransObj(transitionObject(ctx.direction))
    }, [ctx.direction])

    useEffect(()=>{
        // ====================
        // Page Identification
        
        // This effect assigns this node an id
        // This id correspondes the the Carousel index
        // If the index matches the pageId, this node will transition in

        // The id is assigned by its current position as child of Carousel
        // The cleanup function removes its id from the Carousel context
        // ====================

        if(!pageId && pageId !==0) {
            const id = ctx.pages.length
            setPage(id)
            ctx.pages = [...ctx.pages, id]
        }
        return () => ctx.pages = ctx.pages.splice(pageId, 1)
    }, [])


    useEffect(()=>{
        // ====================
        // Setting Height

        // This effect sets the height to match this node, if this node is featured
        // ====================
        const ready = (pageId === ctx.index) && !!boxRef.current 
        ready && (ctx.height = boxRef.current.scrollHeight)

    }, [pageId, ctx.index, boxRef.current?.scrollHeight])

    return transitions((style, item) => (
        <AnimatedBox ref={boxRef} style={{...style, position: 'absolute', width: '100%', display: (item!==pageId && 'none')}}>
            {children}
        </AnimatedBox>
    ))
}