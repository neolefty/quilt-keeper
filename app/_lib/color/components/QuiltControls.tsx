import { QuiltControlButtons } from "./QuiltControlButtons"
import { ColorCard } from "./ColorCard"
import { usePalette } from "../state/PaletteProvider"

export const QuiltControls = () => {
    const { palette } = usePalette()
    return (
        <div className="grid gap-3">
            <QuiltControlButtons />
            <div className="scroll-auto:overflow-y flex flex-col gap-3">
                {palette.driftColors.map((color, idx) => (
                    <ColorCard color={color} idx={idx} key={idx} />
                ))}
            </div>
        </div>
    )
}
