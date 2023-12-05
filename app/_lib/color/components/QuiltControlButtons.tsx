import { usePalette } from "../state/PaletteProvider"
import { useCallback } from "react"
import { useQuilt } from "../../quilt/state/QuiltProvider"
import { stirInNewColor } from "../../quilt/quiltFunctions"
import { SvgIconButton } from "./SvgIconButton"
import { Palette } from "../Palette"
import { useHistory } from "../../history/HistoryProvider"
import { useSaves } from "../../history/SaveProvider"

export const QuiltControlButtons = () => {
    const { palette, sortPalette } = usePalette()
    const { save } = useSaves()
    const { redistributeColors, resetPattern, quilt, setQuilt } = useQuilt()
    const { setHistoryRelative, maxRedo, maxUndo } = useHistory()
    const disperse = useCallback(() => {
        const anneal = [6, 4, 2, 1]
        let newColors = palette
        anneal.forEach((step) => {
            if (newColors === palette) newColors = palette.disperse(step)
        })
        if (newColors !== palette) sortPalette(newColors)
    }, [palette, sortPalette])
    const addColor = useCallback(() => {
        const [newColors, newColor] = palette.addRandomColor(4)
        sortPalette(newColors)
        const colorCount = newColors.length
        setQuilt(stirInNewColor(quilt, colorCount, newColor))
    }, [palette, quilt, setQuilt, sortPalette])
    // preserve arrangement of colors in the quilt, but replace each one
    const randomizePalette = useCallback(() => {
        const randomColors = Palette.construct(palette.length, false, 3)
        let newPalette = palette
        randomColors.driftColors.forEach((color, idx) => {
            const oldColor = palette.driftColors[idx]
            if (!oldColor.isPinned)
                newPalette = newPalette.replaceColor(idx, color, true)
        })
        sortPalette(newPalette)
    }, [palette, sortPalette])
    return (
        <div className="grid grid-cols-6 gap-3">
            <SvgIconButton
                title="Save"
                className="btn btn-accent col-span-2"
                onClick={save}
                icon="save"
            />
            <SvgIconButton
                title="Undo"
                className="btn btn-accent col-span-2"
                disabled={maxUndo === 0}
                onClick={() => setHistoryRelative(-1)}
                icon="undo"
            />
            <SvgIconButton
                title="Redo"
                className="btn btn-accent col-span-2"
                disabled={maxRedo === 0}
                onClick={() => setHistoryRelative(1)}
                icon="redo"
            />
            <hr className="col-span-6" />
            <h2 className="col-span-6 text-center font-bold text-xl -my-2">
                Shapes
            </h2>
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
            <hr className="col-span-6" />
            <h2 className="col-span-6 text-center font-bold text-xl -my-2">
                Palette
            </h2>
            <SvgIconButton
                title="Enhance colors — increase contrast"
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
