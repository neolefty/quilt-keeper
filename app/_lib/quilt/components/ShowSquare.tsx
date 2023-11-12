import { isMoreSquares, Square } from "../../square/Square"
import { Fragment } from "react"
import { ShowTile } from "./ShowTile"

export const ShowSquare = ({ square: { tiles } }: { square: Square }) => {
    if (isMoreSquares(tiles)) {
        const scaleX = 1 / tiles.length
        return (
            <>
                {tiles.map((column, x) => {
                    const scaleY = 1 / column.length
                    const translateX = 100 * x * scaleX
                    return (
                        <Fragment key={x}>
                            {column.map((square, y) => {
                                const translateY = 100 * y * scaleY
                                return (
                                    <g
                                        key={y}
                                        transform={`translate(${translateX}, ${translateY}) scale(${scaleX}, ${scaleY})`}
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
    } else
        return (
            <>
                {tiles.map((tile, idx) => (
                    <ShowTile tile={tile} key={idx} />
                ))}
            </>
        )
}
