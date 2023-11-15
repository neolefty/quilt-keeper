import { useQuilt } from "../QuiltProvider"
import { useColors } from "../../color/state/ColorsProvider"
import { useCallback } from "react"
import { isGrid } from "../../square/Square"
import { addStripe, Side } from "../quiltFunctions"

export function QuiltMarginControls(props: {
    controlMargin: number
    width: number
    height: number
}) {
    return (
        <>
            <g transform={`translate(0 -${props.controlMargin})`}>
                <QuiltMarginBar
                    side="top"
                    height={props.controlMargin}
                    width={props.width}
                />
            </g>
            <g transform={`translate(${props.width} 0)`}>
                <QuiltMarginBar
                    side="right"
                    height={props.height}
                    width={props.controlMargin}
                />
            </g>
            <g transform={`translate(0 ${props.height})`}>
                <QuiltMarginBar
                    side="bottom"
                    height={props.controlMargin}
                    width={props.width}
                />
            </g>
            <g transform={`translate(-${props.controlMargin} 0)`}>
                <QuiltMarginBar
                    side="left"
                    height={props.height}
                    width={props.controlMargin}
                />
            </g>
        </>
    )
}

const QuiltMarginBar = ({
    side,
    height,
    width,
}: {
    side: Side
    height: number
    width: number
}) => {
    const { quilt, setQuilt } = useQuilt()
    const { colors } = useColors()
    const add = useCallback(() => {
        if (!isGrid(quilt)) return
        setQuilt(addStripe(quilt, side, colors))
    }, [colors, quilt, setQuilt, side])
    return (
        <>
            <rect
                opacity={0}
                className="cursor-pointer transition-opacity duration-200 active:opacity-60 hover:opacity-20"
                x={0}
                y={0}
                width={width}
                height={height}
                fill="#777"
                onClick={add}
            />
        </>
    )
}
