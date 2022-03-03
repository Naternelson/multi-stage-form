import { createContext, useRef, useState } from "react"
import Carousel from "./carousel"
import { CarouselPage } from "./page"
import usePageNavigation from "./usePageNavigation"

const Context = createContext()
export default function CarouselWrapper(props){
    // ====================
    // A Provider to hold a Carousel Effect
    // The children of this container, if a Carousel Page
    //      with matching index will transform in off container, either right or left.
    //      The transition relys on react-spring to handle the transition
    // The container itself will transition to accommodate the height of the current featured child

    // index State
    // The index state determines which of the child CarouselPage components will transition in.
    // When the index changes, the current child will transition off

    // height State
    // The child component will relay its size to this container. 
    // When the height is changed, the container will transition to new height

    // direction State
    // Standard transition will transform from right to left, ie 1
    // If the state is changed to a negative number, it will transition from left to right

    // pages Reference
    // This reference is used to help determine the number of pages availiable
    // When a page mounts, it adds its id to the pages array
    // On dismount it removes itself

    // ready Reference
    // A References to indicate it has completed its current transition

    // value Object 
    // An object to handle the store provided to the Provider
    // Through this object, the CarouselPage's and hooks can interact with the Carousel state
    // ====================
    
    const [index, setIndex] = useState(props.index || 0)
    const [height, setHeight] = useState(props.height || 0)
    const [direction, setDirection] = useState(1)
    const pages = useRef([])
    const ready = useRef(true)
    const value = {
        get index(){        return index },
        set index(obj){     setIndex(obj) },
        get height(){       return height },
        set height(obj){    setHeight(obj) },
        get pages(){        return pages.current },
        set pages(obj){     pages.current = obj },
        get direction(){    return direction },
        set direction(num){ setDirection(num) },
        get ready(){        return !!ready.current }, 
        set ready(bool){    ready.current = !!bool }
    }


    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    )
}

CarouselWrapper.Context = Context
CarouselWrapper.Carousel = Carousel
CarouselWrapper.Page = CarouselPage
CarouselWrapper.PageNavigation = usePageNavigation

