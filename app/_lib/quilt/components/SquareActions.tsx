import { SingleSquare, Square } from "../../square/Square"
import { baseLength, baseLength as B } from "../../square/Paths"
import { CircleOfButtons } from "./CircleOfButtons"
import { IconPaths } from "../../icons/IconPaths"
import { useColors } from "../../color/state/ColorsProvider"
import { useMemo } from "react"

import { createRandomSquare, redistributeColors } from "../quiltFunctions"

export const SquareActions = ({
    square,
    setSquare,
}: {
    square: SingleSquare
    setSquare: (square: Square) => void
}) => {
    const icons = useSquareActions({ square, setSquare })
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
    setSquare,
}: {
    square: SingleSquare
    setSquare: (square: Square) => void
}): Partial<Record<keyof typeof IconPaths, MaybeFunction>> => {
    const { colors } = useColors()
    return useMemo(
        () => ({
            rotateLeft: () =>
                setSquare({
                    tiles: square.tiles.map((tile) => ({
                        ...tile,
                        rotation: ((tile.rotation ?? 0) - 90) % 360,
                    })),
                } as SingleSquare),
            rotateRight: () =>
                setSquare({
                    tiles: square.tiles.map((tile) => ({
                        ...tile,
                        rotation: ((tile.rotation ?? 0) + 90) % 360,
                    })),
                } as SingleSquare),
            d6: () => setSquare(createRandomSquare(colors)),
            paintBrush: () => setSquare(redistributeColors(square, colors)),
            // trash: undefined,
            // reroute: undefined,
        }),
        [colors, setSquare, square],
    )
}
