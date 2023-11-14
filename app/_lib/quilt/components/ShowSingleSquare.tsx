import { SingleSquare, Square } from "../../square/Square"
import { ShowTile } from "./ShowTile"
import { useHover } from "@mantine/hooks"
import { baseLength as B } from "../../square/Paths"
import { IconG } from "../../icons/Trash"
import { useColors } from "../../color/state/ColorsProvider"
import { createRandomSquare } from "../QuiltProvider"

// scale up buttons (viewbox 0 0 24 24) to be half of baseLength aka quarter of a tile side
const buttonScale = (B * 0.8) / 24

export const ShowSingleSquare = ({
    square,
    setSquare,
}: {
    square: SingleSquare
    setSquare: (square: Square) => void
}) => {
    const { colors } = useColors()
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
            {hovered && (
                <g>
                    <rect
                        opacity={0}
                        className="hover:opacity-100 transition-opacity duration-200"
                        fill="#00000033"
                        x={-B}
                        y={-B}
                        width={B * 2}
                        height={B * 2}
                    />
                    <g
                        transform={`translate(${B / 10} ${
                            B / 10
                        }) scale(${buttonScale} ${buttonScale})`}
                        className="cursor-pointer"
                    >
                        <rect
                            opacity={0}
                            fill="#000"
                            x={0}
                            y={0}
                            width={24}
                            height={24}
                            className="hover:opacity-20 active:opacity-60 transition-opacity duration-200"
                            rx={4}
                            onClick={() => {
                                const square = createRandomSquare(colors)
                                console.log(square)
                                setSquare(square)
                            }}
                        />
                        <IconG className="pointer-events-none" icon="trash" />
                    </g>
                </g>
            )}
        </g>
    )
}
