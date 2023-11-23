import { QuiltControlButtons } from "./QuiltControlButtons"
import { ColorCard } from "./ColorCard"
import { useColors } from "../state/ColorsProvider"

export const QuiltControls = () => {
    const { colors, setColors, sortColors } = useColors()
    return (
        <div className="grid gap-3">
            <QuiltControlButtons />
            {colors.driftColors.map((color, idx) => (
                <ColorCard color={color} idx={idx} key={idx} />
            ))}
        </div>
    )
}
