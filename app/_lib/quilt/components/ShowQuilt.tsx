import { useColorPodge } from "../../color/state/ColorsProvider"
import { useQuilt } from "../QuiltProvider"
import { ShowSquare } from "./ShowSquare"
import { isGrid } from "../../square/Square"
import { baseLength } from "../../square/Paths"

export const ShowQuilt = () => {
    const { quilt, setQuilt } = useQuilt()
    const { colors } = useColorPodge()
    const tiles = quilt.tiles
    const [width, height] = isGrid(quilt)
        ? [quilt.tiles.length, quilt.tiles[0].length]
        : [1, 1]
    return (
        <svg
            className="max-h-full max-w-full quiltArea"
            viewBox={`0 0 ${baseLength * width * 2} ${baseLength * height * 2}`}
        >
            <ShowSquare square={quilt} setSquare={setQuilt} />
        </svg>
    )
}
