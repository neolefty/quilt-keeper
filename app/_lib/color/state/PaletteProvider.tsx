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
    sortPalette: (palette: Palette) => void
    setPalette: (palette: Palette) => void
}

const defaultPaletteState: PaletteState = {
    palette: new Palette(),
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
    children,
}: PropsWithChildren<{
    defaultCount?: number
}>) => {
    if (defaultCount < 1) throw new Error("defaultCount must be at least 1")
    const [palette, setPalette] = useState(new Palette())
    const sortPalette = useCallback((newPalette: Palette) => {
        const sortedPalette = newPalette.sort(rainbowOrder)
        setPalette(sortedPalette)
    }, [])
    useEffect(() => {
        // start with the default number of colors
        if (palette.length === 0)
            sortPalette(Palette.construct(defaultCount, false, 3))
    }, [defaultCount, palette, sortPalette])
    const state = useMemo<PaletteState>(
        () => ({
            setPalette: setPalette,
            sortPalette: sortPalette,
            palette: palette,
        }),
        [palette, sortPalette],
    )
    return (
        <PaletteContext.Provider value={state}>
            {children}
        </PaletteContext.Provider>
    )
}

const rainbowOrder = (a: DriftColor, b: DriftColor) => a.hue - b.hue

export const usePalette = () => useContext(PaletteContext)
