import { useColors } from "../state/ColorsProvider"
import { useCallback } from "react"
import { useQuilt } from "../../quilt/state/QuiltProvider"
import { stirInNewColor } from "../../quilt/quiltFunctions"
import { useHistory } from "../../quilt/state/HistoryProvider"
import { SvgIconButton } from "./SvgIconButton"
import { Palette } from "../Palette"

export const QuiltControlButtons = () => {
    const { colors, sortColors } = useColors()
    const { redistributeColors, resetPattern, quilt, setQuilt } = useQuilt()
    const { setHistoryRelative, maxRedo, maxUndo } = useHistory()
    const disperse = useCallback(() => {
        const anneal = [6, 4, 2, 1]
        let newColors = colors
        anneal.forEach((step) => {
            if (newColors === colors) newColors = colors.disperse(step)
        })
        if (newColors !== colors) sortColors(newColors)
    }, [colors, sortColors])
    const addColor = useCallback(() => {
        const [newColors, newColor] = colors.addRandomColor(4)
        sortColors(newColors)
        const colorCount = newColors.length
        setQuilt(stirInNewColor(quilt, colorCount, newColor))
    }, [colors, quilt, setQuilt, sortColors])
    // preserve arrangement of colors in the quilt, but replace each one
    const randomizePalette = useCallback(() => {
        const randomColors = Palette.construct(colors.length, false, 3)
        let newPalette = colors
        randomColors.driftColors.forEach((color, idx) => {
            newPalette = newPalette.replaceColor(idx, color, true)
        })
        sortColors(newPalette)
    }, [colors, sortColors])
    return (
        <div className="grid grid-cols-6 gap-3">
            <SvgIconButton
                title="Save"
                className="btn btn-accent col-span-2"
                disabled={maxUndo === 0}
                onClick={() => setHistoryRelative(-1)}
                icon="floppyDisk"
            />
            <SvgIconButton
                title="Undo"
                className="btn btn-accent col-span-2"
                disabled={maxUndo === 0}
                onClick={() => setHistoryRelative(-1)}
                icon="rotateLeft"
            />
            <SvgIconButton
                title="Redo"
                className="btn btn-accent col-span-2"
                disabled={maxRedo === 0}
                onClick={() => setHistoryRelative(1)}
                icon="rotateRight"
            />
            <SvgIconButton
                title="Redistribute colors"
                className="btn btn-primary col-span-3"
                onClick={redistributeColors}
                icon="paintBrush"
            />
            <SvgIconButton
                className="btn btn-primary col-span-3"
                onClick={resetPattern}
                title="Randomize Quilt"
                icon="d6"
            />
            <SvgIconButton
                title="Enhance colors"
                className="btn btn-secondary col-span-2"
                onClick={disperse}
                icon="sparkle"
            />
            <SvgIconButton
                title="Randomize Palette"
                className="btn btn-secondary col-span-2"
                onClick={randomizePalette}
                icon="d6"
            />
            <SvgIconButton
                title="Add a new color"
                className="btn btn-secondary col-span-2"
                onClick={addColor}
                icon="plus"
            />
        </div>
    )
}
