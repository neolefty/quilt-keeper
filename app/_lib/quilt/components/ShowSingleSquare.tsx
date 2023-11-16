import { SingleSquare, Square } from "../../square/Square"
import { ShowTile } from "./ShowTile"
import { useHover } from "@mantine/hooks"
import { SquareActions } from "./SquareActions"
import { SingleSquareProps } from "./SingleSquareProps"

export const ShowSingleSquare = (props: SingleSquareProps) => {
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
