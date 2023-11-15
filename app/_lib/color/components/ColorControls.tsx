import { ColorControlButtons } from "./ColorControlButtons"
import { ColorCard } from "./ColorCard"
import { useColors } from "../state/ColorsProvider"

export const ColorControls = () => {
    const { colors, setColors, sortColors } = useColors()
    return (
        <div className="grid gap-3">
            <ColorControlButtons />
            <hr />
            {colors.driftColors.map((color, idx) => (
                <ColorCard color={color} idx={idx} key={idx} />
            ))}
        </div>
    )
}
