import { useMemo } from "react"
import { mapQuiltTiles } from "../../square/Square"
import { baseLength } from "../../square/Paths"
import { CircleOfButtons, IconCircle } from "./CircleOfButtons"
import { usePalette } from "../../color/state/PaletteProvider"
import { createRandomSquare, redistributeColors } from "../quiltFunctions"
import { EditSingleSquareProps } from "./SingleSquareProps"
import { useEditSquare } from "../state/EditSquareProvider"
import { GlassSquare } from "./GlassSquare"

export const SquareActions = (props: EditSingleSquareProps) => {
    const icons = useSquareActions(props)
    return (
        <g>
            <GlassSquare />
            <CircleOfButtons icons={icons} outerRadius={baseLength * 0.9} />
        </g>
    )
}

const useSquareActions = ({
    square,
    setSquare,
    flipCopySquare,
}: EditSingleSquareProps): IconCircle => {
    const { palette } = usePalette()
    const { editingSquare, setEditingSquare } = useEditSquare()
    return useMemo(
        () => ({
            ring: suppressAll({
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
                paintBrush: () => {
                    setSquare(redistributeColors(square, palette))
                    // setEditingSquare(editingSquare ? undefined : square)
                },
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
            }),
            center: suppressAll({
                d6: () => setSquare(createRandomSquare(palette)),
            }),
        }),
        [
            palette,
            editingSquare,
            flipCopySquare,
            setEditingSquare,
            setSquare,
            square,
        ],
    )
}

const suppressAll = (actions: Record<string, () => void>) => {
    return Object.fromEntries(
        Object.entries(actions).map(([key, fn]) => [
            key,
            suppressPropagation(fn),
        ]),
    )
}

const suppressPropagation = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
}
