import { useColors } from "../state/ColorsProvider"

export const ColorControlButtons = () => {
    const { colors, sortColors } = useColors()
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
                onClick={() =>
                    sortColors(
                        // the more colors there are, the longer it takes to check distance,
                        // and also the less it matters if the new color is close to the others.
                        colors.addRandomColor(Math.max(5, 100 / colors.length)),
                    )
                }
            >
                Add
            </button>
        </div>
    )
}
