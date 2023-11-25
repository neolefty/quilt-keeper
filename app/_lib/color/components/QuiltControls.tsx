import { QuiltControlButtons } from "./QuiltControlButtons"
import { ColorCard } from "./ColorCard"
import { usePalette } from "../state/PaletteProvider"

export const QuiltControls = () => {
    const { palette, setPalette, sortPalette } = usePalette()
    return (
        <div className="grid gap-3">
            <QuiltControlButtons />
            {palette.driftColors.map((color, idx) => (
                <ColorCard color={color} idx={idx} key={idx} />
            ))}
        </div>
    )
}
