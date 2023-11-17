import { useMemo } from "react"
import { mapQuiltTiles, SingleSquare } from "../../square/Square"
import { baseLength, baseLength as B } from "../../square/Paths"
import { CircleOfButtons, IconCircle } from "./CircleOfButtons"
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
    setSquare,
    flipCopySquare,
}: SingleSquareProps): IconCircle => {
    const { colors } = useColors()
    return useMemo(
        () => ({
            ring: {
                flipUp: () => flipCopySquare(0, -1),
                rotateRight: () =>
                    setSquare(
                        mapQuiltTiles(square, (tile) => ({
                            ...tile,
                            rotation: ((tile.rotation ?? 0) + 90) % 360,
                        })),
                    ),
                flipRight: () => flipCopySquare(1, 0),
                reverse: () =>
                    setSquare(
                        mapQuiltTiles(square, (tile) => ({
                            ...tile,
                            rotation: 360 - (tile.rotation ?? 0),
                            mirror: !tile.mirror,
                        })),
                    ),
                flipDown: () => flipCopySquare(0, 1),
                paintBrush: () => setSquare(redistributeColors(square, colors)),
                flipLeft: () => flipCopySquare(-1, 0),
                rotateLeft: () =>
                    setSquare(
                        mapQuiltTiles(square, (tile) => ({
                            ...tile,
                            rotation: ((tile.rotation ?? 0) - 90) % 360,
                        })),
                    ),
                // trash: undefined,
                // reroute: undefined,
            },
            center: {
                d6: () => setSquare(createRandomSquare(colors)),
            },
        }),
        [colors, flipCopySquare, setSquare, square],
    )
}
