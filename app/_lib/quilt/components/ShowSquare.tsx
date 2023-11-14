import { GridOfSquares, isGrid, Square } from "../../square/Square"
import { Fragment, useCallback } from "react"
import { baseLength } from "../../square/Paths"
import { ShowSingleSquare } from "./ShowSingleSquare"

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
        return <ShowSingleSquare square={square} setSquare={setSquare} />
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
            // make a copy ...
            const newTiles = [...tiles.map((column) => [...column])]
            // ... and edit it ...
            newTiles[x][y] = square
            // ... and pass it up to the parent
            setSquare({ tiles: newTiles } as GridOfSquares) // annotate that arrays are not empty
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
