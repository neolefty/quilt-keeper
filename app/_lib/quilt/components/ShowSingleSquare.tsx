import { useCallback, useMemo } from "react"
import { OneOrMore } from "../../FixedLengthArrays"
import { SingleSquare, Tile } from "../../square/Square"
import { ShowSquareProps } from "./ShowSquare"
import {
    EditSingleSquareProps,
    isEditSingleSquareProps,
    SingleSquareProps,
} from "./SingleSquareProps"
import { useHover } from "@mantine/hooks"
import { ShowTile } from "./ShowTile"
import { SquareActions } from "./SquareActions"
import { useEditSquare } from "../state/EditSquareProvider"
import { GlassSquare } from "./GlassSquare"
import { baseLength } from "../../square/Paths"
import { CircleButton } from "./CircleOfButtons"
import { redistributeColors } from "../quiltFunctions"
import { usePalette } from "../../color/state/PaletteProvider"

export interface ShowSingleSquareProps extends ShowSquareProps {
    square: SingleSquare
}

export const ShowSingleSquare = ({
    square,
    setSquare,
    outerSquare,
    setOuterSquare,
    x,
    y,
}: ShowSingleSquareProps) => {
    if (!outerSquare)
        throw new Error(
            "expect outer square to be present when rendering a single square",
        )
    if (x === undefined || y === undefined)
        throw new Error(
            "expected x and y to be present when rendering a single square",
        )
    const flipCopySquare = useMemo(
        () =>
            setOuterSquare &&
            ((dx: number, dy: number) => {
                const newSquares = [
                    ...outerSquare.squares.map((column) => [...column]),
                ]
                const [width, height] = [
                    newSquares.length,
                    newSquares[0].length,
                ]
                const [newX, newY] = [
                    (x + dx + width) % width,
                    (y + dy + height) % height,
                ]
                newSquares[newX][newY] = {
                    tiles: square.tiles.map((tile) => ({
                        ...tile,
                        rotation:
                            (dy === 0
                                ? // flip horizontally — need to reverse rotation as well as mirror horizontally
                                  360 - (tile.rotation ?? 0)
                                : // flip vertically — since mirroring is horizontal, reversing rotation is a little wonkier
                                  360 - (tile.rotation ?? 0) + 180) % 360,
                        // note that mirroring is horizontal: transform(-1, 1)
                        mirror: !tile.mirror,
                    })) as OneOrMore<Tile>,
                }
                setOuterSquare({ squares: newSquares }) // annotate that arrays are not empty
            }),
        [outerSquare.squares, setOuterSquare, square.tiles, x, y],
    )
    return (
        <RenderSingleSquare
            square={square}
            outerSquare={outerSquare}
            setSquare={setSquare}
            x={x}
            y={y}
            flipCopySquare={flipCopySquare}
        />
    )
}

const RenderSingleSquare = (props: SingleSquareProps) => {
    // useHover isn't typed for SVG elements, but it works fine
    // @ts-ignore
    const { hovered, ref } = useHover<SVGGElement>()
    const { editingSquare, cancelEditingSquare } = useEditSquare()
    const editingThisSquare = editingSquare === props.square
    const editingAnotherSquare = editingSquare && !editingThisSquare
    if (editingAnotherSquare && !props.setSquare)
        throw new Error("Editing requires setSquare to be defined.")
    // const [width, height] = [tiles.length, tiles[0].length]
    // const scaleX = 1 / width
    // const scaleY = 1 / height
    return (
        <g ref={ref}>
            {props.square.tiles.map((tile, idx) => (
                <ShowTile tile={tile} key={idx} />
            ))}
            {editingAnotherSquare && (
                <GlassSquare
                    className="opacity-100"
                    fill="#00000077"
                    onClick={cancelEditingSquare}
                />
            )}
            {editingThisSquare && isEditSingleSquareProps(props) && (
                <EditSquare {...props} />
            )}
            {hovered && !editingSquare && isEditSingleSquareProps(props) && (
                <SquareActions {...props} />
            )}
        </g>
    )
}

const EditSquare = ({ square, setSquare }: EditSingleSquareProps) => {
    const buttonRadius = 0.3 * baseLength
    const { palette } = usePalette()
    const { setEditingSquare } = useEditSquare()
    return (
        <CircleButton
            r={buttonRadius}
            onClick={() => {
                const newSquare = redistributeColors(square, palette)
                setSquare(newSquare)
                setEditingSquare(newSquare)
            }}
            icon="d6"
        />
    )
}
