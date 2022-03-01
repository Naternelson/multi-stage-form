import { Slide } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { FormContext } from "../multi-stage-form";

export default function Step({step, children}){
    const [direction, setDirection] = useState("left")
    const {selector} =  useContext(FormContext)
    const currentPage = selector(s => s.currentPage)
    const addEndListener =  () => setDirection(direction => direction === "left" ? "right" : "left")
    const slideProps = {appear:false, addEndListener, direction, in: currentPage === step}
    return (
        <Slide {...slideProps}>
            {children}
        </Slide>
    )
}