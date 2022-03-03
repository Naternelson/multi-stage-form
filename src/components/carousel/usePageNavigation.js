import { useCallback, useContext } from "react";
import CarouselWrapper from "."

export default function usePageNavigation(options={loop: true, delay:0}){
    const ctx = useContext(CarouselWrapper.Context)
    const navigateTo = useCallback(newIndex => setTimeout(() => ctx.index = newIndex, options.delay) , [ctx.index])
    const navigateBack = useCallback(() =>{
        const isReady = ctx.ready 
        if(!isReady) return 
        ctx.direction = -1
        const isStart = ctx.index === 0 
        !isStart && navigateTo(ctx.index - 1)
        const needsLoop = isStart && options.loop 
        needsLoop && navigateTo(ctx.pages.length -1)
    }, [ctx.direction, navigateTo, ctx.pages, options.loop, ctx.index])

    const navigateForward = useCallback(() =>{
        const isReady = ctx.ready 
        if(!isReady) return 
        ctx.direction = 1
        const isEnd = ctx.index === (ctx.pages.length -1) 
        !isEnd && navigateTo(ctx.index + 1)
        const needsLoop = isEnd && options.loop 
        needsLoop && navigateTo(0)
    }, [ctx.direction, navigateTo, ctx.pages, options.loop, ctx.index])

    

    return {navigateTo, navigateBack, navigateForward}
}