import { isMoreSquares, Square } from "../../square/Square"
import { Fragment } from "react"
import { ShowTile } from "./ShowTile"
import { baseLength } from "../../square/Paths"

/** Render a quilt square as SVG. */
export const ShowSquare = ({ square: { tiles } }: { square: Square }) => {
    if (isMoreSquares(tiles)) {
        return (
            <>
                {tiles.map((column, x) => {
                    const translateX = baseLength + baseLength * 2 * x
                    return (
                        <Fragment key={x}>
                            {column.map((square, y) => {
                                const translateY =
                                    baseLength + baseLength * 2 * y
                                return (
                                    <g
                                        key={y}
                                        transform={`translate(${translateX}, ${translateY})`}
                                    >
                                        <ShowSquare square={square} />
                                    </g>
                                )
                            })}
                        </Fragment>
                    )
                })}
            </>
        )
    } else {
        // const [width, height] = [tiles.length, tiles[0].length]
        // const scaleX = 1 / width
        // const scaleY = 1 / height
        return (
            <>
                {tiles.map((tile, idx) => (
                    <ShowTile tile={tile} key={idx} />
                ))}
            </>
        )
    }
}
