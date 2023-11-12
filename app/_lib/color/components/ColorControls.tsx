import { ColorControlButtons } from "./ColorControlButtons"
import { PodgeColorCard } from "./PodgeColorCard"
import { useColorPodge } from "../state/ColorsProvider"

export const ColorControls = () => {
    const { colors, setColors, sortColors } = useColorPodge()
    return (
        <div className="grid gap-3">
            <ColorControlButtons />
            <hr />
            {colors.driftColors.map((color, idx) => (
                <PodgeColorCard color={color} idx={idx} key={idx} />
            ))}
        </div>
    )
}
