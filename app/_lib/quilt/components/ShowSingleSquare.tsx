import { useCallback } from "react"
import { OneOrMore } from "../../FixedLengthArrays"
import { GridOfSquares, SingleSquare, Tile } from "../../square/Square"
import { ShowSquareProps } from "./ShowSquare"
import { SingleSquareProps } from "./SingleSquareProps"
import { useHover } from "@mantine/hooks"
import { ShowTile } from "./ShowTile"
import { SquareActions } from "./SquareActions"

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
    if (!outerSquare || !setOuterSquare)
        throw new Error(
            "expect outer square to be present when rendering a single square",
        )
    if (x === undefined || y === undefined)
        throw new Error(
            "expected x and y to be present when rendering a single square",
        )
    const flipCopySquare = useCallback(
        (dx: number, dy: number) => {
            const newTiles = [...outerSquare.tiles.map((column) => [...column])]
            const [width, height] = [newTiles.length, newTiles[0].length]
            const [newX, newY] = [
                (x + dx + width) % width,
                (y + dy + height) % height,
            ]
            newTiles[newX][newY] = {
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
            setOuterSquare({ tiles: newTiles } as GridOfSquares) // annotate that arrays are not empty
        },
        [outerSquare.tiles, setOuterSquare, square.tiles, x, y],
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
    // const [width, height] = [tiles.length, tiles[0].length]
    // const scaleX = 1 / width
    // const scaleY = 1 / height
    return (
        <g ref={ref}>
            {props.square.tiles.map((tile, idx) => (
                <ShowTile tile={tile} key={idx} />
            ))}
            {hovered && <SquareActions {...props} />}
        </g>
    )
}
