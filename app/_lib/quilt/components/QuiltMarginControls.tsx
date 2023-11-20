import { useQuilt } from "../state/QuiltProvider"
import { useColors } from "../../color/state/ColorsProvider"
import { useCallback } from "react"
import { isGrid } from "../../square/Square"
import {
    addStripe,
    quiltDimensions,
    removeStripe,
    Side,
} from "../quiltFunctions"

export function QuiltMarginControls({
    controlMargin,
    height,
    width,
}: {
    controlMargin: number
    width: number
    height: number
}) {
    return (
        <>
            <defs>
                <pattern
                    id="plus"
                    patternUnits="userSpaceOnUse"
                    width={controlMargin}
                    height={controlMargin}
                    viewBox="0 0 24 24"
                >
                    <rect width={24} height={24} fill="#fff" />
                    <path
                        d="M4 12L20 12M12 4L12 20z"
                        stroke="#000"
                        strokeWidth={4}
                        strokeLinecap="butt"
                    />
                </pattern>
                <pattern
                    id="minus"
                    patternUnits="userSpaceOnUse"
                    width={controlMargin}
                    height={controlMargin}
                    viewBox="0 0 24 24"
                >
                    <rect width={24} height={24} fill="#fff" />
                    <path
                        d="M4 12L20 12z"
                        stroke="#000"
                        strokeWidth={4}
                        strokeLinecap="butt"
                    />
                </pattern>
            </defs>
            <g transform={`translate(0 -${controlMargin})`}>
                <QuiltMarginBar
                    side="top"
                    height={controlMargin}
                    width={width}
                />
            </g>
            <g transform={`translate(${width} 0)`}>
                <QuiltMarginBar
                    side="right"
                    height={height}
                    width={controlMargin}
                />
            </g>
            <g transform={`translate(0 ${height})`}>
                <QuiltMarginBar
                    side="bottom"
                    height={controlMargin}
                    width={width}
                />
            </g>
            <g transform={`translate(-${controlMargin} 0)`}>
                <QuiltMarginBar
                    side="left"
                    height={height}
                    width={controlMargin}
                />
            </g>
            <Corners m={controlMargin} h={height} w={width} />
        </>
    )
}

const horizontal = {
    top: true,
    right: false,
    left: false,
    bottom: true,
}

const marginClass =
    "cursor-pointer transition-opacity duration-200 active:opacity-80 hover:opacity-40"
const marginOpacity = 0.07

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
    const [w, h] = quiltDimensions(quilt)
    const { colors } = useColors()
    const isHorizontal = horizontal[side]
    const canRemove = isHorizontal ? h > 1 : w > 1
    const add = useCallback(() => {
        if (!isGrid(quilt)) return
        setQuilt(addStripe(quilt, side, colors))
    }, [colors, quilt, setQuilt, side])
    const remove = useCallback(() => {
        if (!isGrid(quilt)) return
        setQuilt(removeStripe(quilt, side))
    }, [quilt, setQuilt, side])
    return (
        <>
            <rect
                opacity={marginOpacity}
                className={marginClass}
                x={0}
                y={0}
                width={isHorizontal ? width / 2 : width}
                height={isHorizontal ? height : height / 2}
                fill="url(#plus)"
                onClick={add}
            />
            {canRemove && (
                <rect
                    opacity={marginOpacity}
                    className={marginClass}
                    x={isHorizontal ? width / 2 : 0}
                    y={isHorizontal ? 0 : height / 2}
                    width={isHorizontal ? width / 2 : width}
                    height={isHorizontal ? height : height / 2}
                    fill="url(#minus)"
                    onClick={remove}
                />
            )}
        </>
    )
}

// Fill in the corners for visual consistency in dark mode
const Corners = ({ m, h, w }: { m: number; h: number; w: number }) => {
    const translations = [
        `-${m} -${m}`,
        `${w} -${m}`,
        `-${m} ${h}`,
        `${w} ${h}`,
    ]
    return translations.map((t, idx) => (
        <rect
            key={idx}
            transform={`translate(${t})`}
            width={m}
            height={m}
            opacity={marginOpacity}
            fill="#fff"
        />
    ))
}
