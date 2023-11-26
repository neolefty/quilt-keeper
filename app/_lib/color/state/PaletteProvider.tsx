import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { Palette } from "../Palette"
import { DriftColor } from "../DriftColor"

interface PaletteState {
    palette: Palette
    // if true, overwrite the previous state in undo history
    clobber: boolean
    // global state sequence (used for undo, with clobber)
    serial: number

    /**
     * Sort the palette by hue.
     * @param clobber If true, overwrite the previous state in undo history.
     */
    sortPalette: (palette: Palette, clobber?: boolean) => void
    /**
     * Update the palette.
     * @param clobber If true, overwrite the previous state in undo history.
     */
    setPalette: (palette: Palette, clobber?: boolean) => void
}

const defaultPaletteState: PaletteState = {
    palette: new Palette(),
    clobber: false,
    serial: NaN,
    sortPalette: () => {
        throw new Error("not implemented")
    },
    setPalette: () => {
        throw new Error("not implemented")
    },
}

const PaletteContext = createContext(defaultPaletteState)

export const PaletteProvider = ({
    defaultCount = 4,
    serial,
    children,
}: PropsWithChildren<{
    defaultCount?: number
    serial: [number]
}>) => {
    if (defaultCount < 1) throw new Error("defaultCount must be at least 1")
    const [{ palette, clobber }, setPalette] = useState({
        clobber: false,
        palette: new Palette(),
    })
    const sortPalette = useCallback(
        (newPalette: Palette, clobber = false) =>
            setPalette({ palette: newPalette.sort(rainbowOrder), clobber }),
        [],
    )
    useEffect(() => {
        // start with the default number of colors
        if (palette.length === 0)
            sortPalette(Palette.construct(defaultCount, false, 3), true)
    }, [defaultCount, palette, sortPalette])
    const state = useMemo<PaletteState>(
        () => ({
            setPalette: (palette, clobber = false) =>
                setPalette({ palette, clobber }),
            sortPalette,
            palette,
            clobber,
            serial: serial[0]++,
        }),
        [clobber, palette, serial, sortPalette],
    )
    return (
        <PaletteContext.Provider value={state}>
            {children}
        </PaletteContext.Provider>
    )
}

const rainbowOrder = (a: DriftColor, b: DriftColor) => a.hue - b.hue

export const usePalette = () => useContext(PaletteContext)
