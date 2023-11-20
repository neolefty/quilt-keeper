import { useQuilt } from "../state/QuiltProvider"
import { ShowSquare } from "./ShowSquare"
import { baseLength } from "../../square/Paths"
import { QuiltMarginControls } from "./QuiltMarginControls"
import { quiltDimensions } from "../quiltFunctions"

export const ShowQuilt = () => {
    const { quilt, setQuilt } = useQuilt()
    const [width, height] = quiltDimensions(quilt)
    const quiltHeight = baseLength * height * 2
    const quiltWidth = baseLength * width * 2
    const controlMargin = Math.sqrt(quiltWidth * quiltHeight) * 0.05
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
