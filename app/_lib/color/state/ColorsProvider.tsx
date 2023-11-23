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

interface ColorsState {
    colors: Palette
    sortColors: (colors: Palette) => void
    setColors: (colors: Palette) => void
}

const defaultColorsState: ColorsState = {
    colors: new Palette(),
    sortColors: () => {
        throw new Error("not implemented")
    },
    setColors: () => {
        throw new Error("not implemented")
    },
}

const ColorsContext = createContext(defaultColorsState)

export const ColorsProvider = ({
    defaultCount = 4,
    children,
}: PropsWithChildren<{
    defaultCount?: number
}>) => {
    if (defaultCount < 1) throw new Error("defaultCount must be at least 1")
    const [colors, setColors] = useState(new Palette())
    const sortColors = useCallback((newPalette: Palette) => {
        const sortedPalette = newPalette.sort(rainbowOrder)
        setColors(sortedPalette)
    }, [])
    useEffect(() => {
        // start with the default number of colors
        if (colors.length === 0)
            sortColors(Palette.construct(defaultCount, false, 3))
    }, [defaultCount, colors, sortColors])
    const state = useMemo<ColorsState>(
        () => ({
            setColors,
            sortColors,
            colors: colors,
        }),
        [colors, sortColors],
    )
    return (
        <ColorsContext.Provider value={state}>
            {children}
        </ColorsContext.Provider>
    )
}

const rainbowOrder = (a: DriftColor, b: DriftColor) => a.hue - b.hue

export const useColors = () => useContext(ColorsContext)
