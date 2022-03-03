import { useCallback, useContext } from "react";
import { Carousel } from "../transition-example";

export default function usePageNavigation(options={loop: true, delay:0}){
    const ctx = useContext(Carousel.Context)
    const navigateTo = useCallback(newIndex => setTimeout(() => ctx.index = newIndex, options.delay) , [ctx.index])
    const navigateBack = useCallback(() =>{
        ctx.direction = -1
        const isStart = ctx.index === 0 
        !isStart && navigateTo(ctx.index - 1)
        const needsLoop = isStart && options.loop 
        needsLoop && navigateTo(ctx.pages.length -1)
    }, [needsLoop, ctx.direction, navigateTo, ctx.pages, options.loop, ctx.index])

    const navigateForward = useCallback(() =>{
        ctx.direction = 1
        const isEnd = ctx.index === (ctx.pages.length -1) 
        !isEnd && navigateTo(ctx.index + 1)
        const needsLoop = isEnd && options.loop 
        needsLoop && navigateTo(0)
    }, [needsLoop, ctx.direction, navigateTo, ctx.pages, options.loop, ctx.index])

    

    return {navigateTo, navigateBack, navigateForward}
}