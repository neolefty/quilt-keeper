import { useMemo } from "react"
import { SingleSquare } from "../../square/Square"
import { baseLength, baseLength as B } from "../../square/Paths"
import { CircleOfButtons } from "./CircleOfButtons"
import { IconPaths } from "../../icons/IconPaths"
import { useColors } from "../../color/state/ColorsProvider"
import { createRandomSquare, redistributeColors } from "../quiltFunctions"
import { SingleSquareProps } from "./SingleSquareProps"

export const SquareActions = (props: SingleSquareProps) => {
    const icons = useSquareActions(props)
    return (
        <g>
            <rect
                opacity={0}
                className="hover:opacity-100 transition-opacity duration-200"
                fill="#00000033"
                x={-B}
                y={-B}
                width={B * 2}
                height={B * 2}
            />
            <CircleOfButtons icons={icons} outerRadius={baseLength * 0.9} />
        </g>
    )
}

type MaybeFunction = (() => void) | undefined

const useSquareActions = ({
    square,
    x,
    y,
    setSquare,
    flipCopySquare,
}: SingleSquareProps): Partial<
    Record<keyof typeof IconPaths, MaybeFunction>
> => {
    const { colors } = useColors()
    return useMemo(
        () => ({
            flipUp: () => flipCopySquare(0, -1),
            rotateRight: () =>
                setSquare({
                    tiles: square.tiles.map((tile) => ({
                        ...tile,
                        rotation: ((tile.rotation ?? 0) + 90) % 360,
                    })),
                } as SingleSquare),
            flipRight: () => flipCopySquare(1, 0),
            d6: () => setSquare(createRandomSquare(colors)),
            flipDown: () => flipCopySquare(0, 1),
            paintBrush: () => setSquare(redistributeColors(square, colors)),
            flipLeft: () => flipCopySquare(-1, 0),
            rotateLeft: () =>
                setSquare({
                    tiles: square.tiles.map((tile) => ({
                        ...tile,
                        rotation: ((tile.rotation ?? 0) - 90) % 360,
                    })),
                } as SingleSquare),
            // trash: undefined,
            // reroute: undefined,
        }),
        [colors, setSquare, square],
    )
}
