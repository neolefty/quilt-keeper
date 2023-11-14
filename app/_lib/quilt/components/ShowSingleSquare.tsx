import { SingleSquare, Square } from "../../square/Square"
import { ShowTile } from "./ShowTile"
import { useHover } from "@mantine/hooks"
import { SquareActions } from "./SquareActions"

export const ShowSingleSquare = ({
    square,
    setSquare,
}: {
    square: SingleSquare
    setSquare: (square: Square) => void
}) => {
    // useHover isn't typed for SVG elements, but it works fine
    // @ts-ignore
    const { hovered, ref } = useHover<SVGGElement>()
    // const [width, height] = [tiles.length, tiles[0].length]
    // const scaleX = 1 / width
    // const scaleY = 1 / height
    return (
        <g ref={ref}>
            {square.tiles.map((tile, idx) => (
                <ShowTile tile={tile} key={idx} />
            ))}
            {hovered && <SquareActions square={square} setSquare={setSquare} />}
        </g>
    )
}
