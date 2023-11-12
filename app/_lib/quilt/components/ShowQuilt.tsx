import { useColorPodge } from "../../color/state/ColorsProvider"
import { useQuilt } from "../QuiltProvider"
import { ShowSquare } from "./ShowSquare"

export const ShowQuilt = () => {
    const { quilt } = useQuilt()
    const { colors } = useColorPodge()
    return (
        <svg viewBox="-100 -100 200 200">
            <ShowSquare square={quilt} />
        </svg>
    )
}
