import { QuiltControlButtons } from "./QuiltControlButtons"
import { ColorCard } from "./ColorCard"
import { usePalette } from "../state/PaletteProvider"

export const QuiltControls = () => {
    const { palette } = usePalette()
    return (
        <>
            <QuiltControlButtons />
            <div className="overflow-y-auto flex flex-col gap-3 min-h-16">
                {palette.driftColors.map((color, idx) => (
                    <ColorCard color={color} idx={idx} key={idx} />
                ))}
            </div>
        </>
    )
}
