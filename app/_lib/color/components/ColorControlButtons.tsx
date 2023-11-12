import { useColorPodge } from "../state/ColorsProvider"

export const ColorControlButtons = () => {
    const { setColors, colors, sortColors } = useColorPodge()
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                className="btn btn-primary"
                onClick={() => sortColors(colors.disperse(2))}
            >
                Step 2
            </button>
            <button
                className="btn btn-primary"
                onClick={() => sortColors(colors.disperse(5))}
            >
                Step 5
            </button>
            <button
                className="btn btn-primary"
                onClick={() => sortColors(colors.disperse(12))}
            >
                Step 12
            </button>
            <button
                className="btn btn-secondary"
                onClick={() => setColors(colors.addRandomColor())}
            >
                Add
            </button>
        </div>
    )
}
