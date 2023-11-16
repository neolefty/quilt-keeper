import {
    GridOfSquares,
    isGrid,
    mapQuiltTiles,
    SingleSquare,
    Square,
    Tile,
} from "../../square/Square"
import { Fragment, useCallback } from "react"
import { baseLength } from "../../square/Paths"
import { ShowSingleSquare } from "./ShowSingleSquare"
import { OneOrMore } from "../../FixedLengthArrays"

interface ShowSquareProps {
    square: Square
    // update this square in the larger quilt
    setSquare: (square: Square) => void
    setOuterSquare?: (square: GridOfSquares) => void
    // is this part of a larger quilt?
    outerSquare?: GridOfSquares
    x?: number
    y?: number
}

/** Render a quilt square as SVG. */
export const ShowSquare = (props: ShowSquareProps) => {
    const { square, setSquare } = props
    if (isGrid(square)) {
        return <ShowGridOfSquares square={square} setSquare={setSquare} />
    } else {
        return <MakeShowSingleSquare {...props} square={square} />
    }
}

interface ShowSingleSquareProps extends ShowSquareProps {
    square: SingleSquare
}

const MakeShowSingleSquare = ({
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
                        // maybe someday I'll be able to explain this, but for now I can't
                        (dy === 0
                            ? 360 - (tile.rotation ?? 0)
                            : 360 - (tile.rotation ?? 0) + 180) % 360,
                    // rotation:
                    //     dx === 0 ? tile.rotation : (tile.rotation ?? 0) + 180,
                    mirror: !tile.mirror,
                })) as OneOrMore<Tile>,
            }
            setOuterSquare({ tiles: newTiles } as GridOfSquares) // annotate that arrays are not empty
        },
        [outerSquare.tiles, setOuterSquare, square.tiles, x, y],
    )
    return (
        <ShowSingleSquare
            square={square}
            outerSquare={outerSquare}
            setSquare={setSquare}
            x={x}
            y={y}
            flipCopySquare={flipCopySquare}
        />
    )
}

export const ShowGridOfSquares = ({
    square: outerSquare,
    setSquare,
}: {
    square: GridOfSquares
    setSquare: (square: Square) => void
}) => {
    // Function to build setSquare functions for each sub-quilt that
    // recursively (anti-recursively?) call setSquare provided by the parent.
    const makeSetSquare = useCallback(
        (x: number, y: number) => (square: Square) => {
            // make a copy ...
            const newTiles = [...outerSquare.tiles.map((column) => [...column])]
            // ... and edit it ...
            newTiles[x][y] = square
            // ... and pass it up to the parent
            setSquare({ tiles: newTiles } as GridOfSquares) // annotate that arrays are not empty
        },
        [setSquare, outerSquare.tiles],
    )
    return (
        <>
            {outerSquare.tiles.map((column, x) => {
                const translateX = baseLength + baseLength * 2 * x
                return (
                    <Fragment key={x}>
                        {column.map((innerSquare, y) => {
                            const translateY = baseLength + baseLength * 2 * y
                            return (
                                <g
                                    key={y}
                                    transform={`translate(${translateX}, ${translateY})`}
                                >
                                    <ShowSquare
                                        square={innerSquare}
                                        setSquare={makeSetSquare(x, y)}
                                        outerSquare={outerSquare}
                                        setOuterSquare={setSquare}
                                        x={x}
                                        y={y}
                                    />
                                </g>
                            )
                        })}
                    </Fragment>
                )
            })}
        </>
    )
}
