import { GridOfSquares, SingleSquare, Square } from "../../square/Square"

export interface SingleSquareProps {
    square: SingleSquare
    outerSquare: GridOfSquares
    x: number
    y: number
    // update this square in the larger quilt
    setSquare?: (square: Square) => void
    // flip this square into the new position, replacing what was there
    flipCopySquare?: (dx: number, dy: number) => void
}

export interface EditSingleSquareProps extends SingleSquareProps {
    setSquare: (square: Square) => void
    flipCopySquare: (dx: number, dy: number) => void
}

export const isEditSingleSquareProps = (
    props: SingleSquareProps,
): props is EditSingleSquareProps => !!props.setSquare && !!props.flipCopySquare
