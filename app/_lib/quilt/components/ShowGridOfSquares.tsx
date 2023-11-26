import { GridOfSquares, Square } from "../../square/Square"
import { Fragment, useCallback } from "react"
import { baseLength } from "../../square/Paths"
import { ShowSquare } from "./ShowSquare"

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
            const newSquares = [
                ...outerSquare.squares.map((column) => [...column]),
            ]
            // ... and edit it ...
            newSquares[x][y] = square
            // ... and pass it up to the parent
            setSquare({ squares: newSquares } as GridOfSquares) // annotate that arrays are not empty
        },
        [setSquare, outerSquare.squares],
    )
    return (
        <>
            {outerSquare.squares.map((column, x) => {
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
