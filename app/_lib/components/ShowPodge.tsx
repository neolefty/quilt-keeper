import { useColorPodge } from "../state/WithColorPodge"
import { PodgeControls } from "./PodgeControls"
import { PodgeColorCard } from "./PodgeColorCard"

export const ShowPodge = () => {
    const { podge, setPodge, sortPodge } = useColorPodge()
    return (
        <div className="grid gap-3">
            <PodgeControls />
            <hr />
            {podge.driftColors.map((color, idx) => (
                <PodgeColorCard color={color} idx={idx} key={idx} />
            ))}
        </div>
    )
}
