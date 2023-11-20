import { useColors } from "../state/ColorsProvider"
import { IconSvg } from "../../icons/IconSvg"
import { useCallback } from "react"
import { useQuilt } from "../../quilt/state/QuiltProvider"
import { stirInNewColor } from "../../quilt/quiltFunctions"

export const QuiltControlButtons = () => {
    const { colors, sortColors } = useColors()
    const { redistributeColors, resetPattern, quilt, setQuilt } = useQuilt()
    const disperse = useCallback(() => {
        const anneal = [6, 4, 2, 1]
        let newColors = colors
        anneal.forEach((step) => {
            if (newColors === colors) newColors = colors.disperse(step)
        })
        if (newColors !== colors) sortColors(newColors)
    }, [colors, sortColors])
    const addColor = useCallback(() => {
        // the more colors there are, the longer it takes to check distance,
        // and also the less it matters if the new color is close to the others.
        const [newColors, newColor] = colors.addRandomColor(
            Math.max(5, 100 / colors.length),
        )
        sortColors(newColors)
        const colorCount = newColors.length
        setQuilt(stirInNewColor(quilt, colorCount, newColor))
    }, [colors, quilt, setQuilt, sortColors])
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                title="Redistribute colors"
                className="btn btn-primary"
                onClick={redistributeColors}
            >
                <IconSvg icon="paintBrush" />
            </button>
            <button
                className="btn btn-primary"
                onClick={resetPattern}
                title="Reset Quilt"
            >
                <IconSvg icon="d6" />
            </button>
            <button
                title="Enhance colors"
                className="btn btn-secondary"
                onClick={disperse}
            >
                <IconSvg icon="sparkle" />
            </button>
            <button
                title="Add a new color"
                className="btn btn-secondary"
                onClick={addColor}
            >
                <IconSvg icon="plus" />
            </button>
        </div>
    )
}
