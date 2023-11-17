import { GridOfSquares, isGrid, Square } from "../../square/Square"
import { ShowSingleSquare } from "./ShowSingleSquare"
import { ShowGridOfSquares } from "./ShowGridOfSquares"

export interface ShowSquareProps {
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
        return <ShowSingleSquare {...props} square={square} />
    }
}
