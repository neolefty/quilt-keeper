import { useColorPodge } from "../../color/state/ColorsProvider"
import { useQuilt } from "../QuiltProvider"
import { ShowSquare } from "./ShowSquare"
import { isMoreSquares } from "../../square/Square"
import { baseLength } from "../../square/Paths"

export const ShowQuilt = () => {
    const { quilt } = useQuilt()
    const { colors } = useColorPodge()
    const tiles = quilt.tiles
    const [width, height] = isMoreSquares(tiles)
        ? [tiles.length, tiles[0].length]
        : [1, 1]
    console.log({ width, height, tiles })
    return (
        <svg
            className="max-h-full max-w-full quiltArea"
            viewBox={`0 0 ${baseLength * width * 2} ${baseLength * height * 2}`}
        >
            <ShowSquare square={quilt} />
        </svg>
    )
}
