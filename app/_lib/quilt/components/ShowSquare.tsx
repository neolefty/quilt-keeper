import { GridOfSquares, isGrid, Square } from "../../square/Square"
import { Fragment, useCallback } from "react"
import { ShowTile } from "./ShowTile"
import { baseLength } from "../../square/Paths"

/** Render a quilt square as SVG. */
export const ShowSquare = ({
    square,
    setSquare,
}: {
    square: Square
    // update this square in the larger quilt
    setSquare: (square: Square) => void
}) => {
    if (isGrid(square)) {
        return <ShowGridOfSquares square={square} setSquare={setSquare} />
    } else {
        // const [width, height] = [tiles.length, tiles[0].length]
        // const scaleX = 1 / width
        // const scaleY = 1 / height
        return (
            <>
                {square.tiles.map((tile, idx) => (
                    <ShowTile tile={tile} key={idx} />
                ))}
            </>
        )
    }
}

export const ShowGridOfSquares = ({
    square: { tiles },
    setSquare,
}: {
    square: GridOfSquares
    setSquare: (square: Square) => void
}) => {
    // Function to build setSquare functions for each sub-quilt that
    // recursively (anti-recursively?) call setSquare provided by the parent.
    const makeSetSquare = useCallback(
        (x: number, y: number) => (square: Square) => {
            return (square: Square) => {
                // make a copy
                const newTiles = [...tiles.map((column) => [...column])]
                newTiles[x][y] = square
                setSquare({ tiles: newTiles } as GridOfSquares) // annotate that arrays are not empty
            }
        },
        [setSquare, tiles],
    )
    return (
        <>
            {tiles.map((column, x) => {
                const translateX = baseLength + baseLength * 2 * x
                return (
                    <Fragment key={x}>
                        {column.map((square, y) => {
                            const translateY = baseLength + baseLength * 2 * y
                            return (
                                <g
                                    key={y}
                                    transform={`translate(${translateX}, ${translateY})`}
                                >
                                    <ShowSquare
                                        square={square}
                                        setSquare={makeSetSquare(x, y)}
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
