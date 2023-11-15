import { useColors } from "../../color/state/ColorsProvider"
import { useQuilt } from "../QuiltProvider"
import { ShowSquare } from "./ShowSquare"
import { baseLength } from "../../square/Paths"
import { QuiltMarginControls } from "./QuiltMarginControls"
import { quiltDimensions } from "../quiltFunctions"

export const ShowQuilt = () => {
    const { quilt, setQuilt } = useQuilt()
    const { colors } = useColors()
    const tiles = quilt.tiles
    const [width, height] = quiltDimensions(quilt)
    const quiltHeight = baseLength * height * 2
    const quiltWidth = baseLength * width * 2
    const controlMargin = Math.sqrt(quiltWidth * quiltHeight) * 0.06
    return (
        <svg
            className="max-h-full max-w-full quiltArea"
            viewBox={`-${controlMargin} -${controlMargin} ${
                quiltWidth + controlMargin * 2
            } ${quiltHeight + controlMargin * 2}`}
        >
            <ShowSquare square={quilt} setSquare={setQuilt} />
            <QuiltMarginControls
                controlMargin={controlMargin}
                width={quiltWidth}
                height={quiltHeight}
            />
        </svg>
    )
}
