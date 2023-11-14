import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { ColorPodge } from "../ColorPodge"

interface ColorsState {
    colors: ColorPodge
    sortColors: (colors: ColorPodge) => void
    setColors: (colors: ColorPodge) => void
}

const DEFAULT_STATE: ColorsState = {
    colors: new ColorPodge(),
    sortColors: () => {
        throw new Error("not implemented")
    },
    setColors: () => {
        throw new Error("not implemented")
    },
}

const ColorsContext = createContext(DEFAULT_STATE)

export const ColorsProvider = ({
    defaultCount = 4,
    children,
}: PropsWithChildren<{
    defaultCount?: number
}>) => {
    const [colors, setColors] = useState(new ColorPodge())
    const sortColors = useCallback((newPodge: ColorPodge) => {
        const sortedPodge = newPodge.sort((a, b) => a.hue - b.hue)
        setColors(sortedPodge)
    }, [])
    useEffect(() => {
        // start with the default number of colors
        if (colors.length === 0 && defaultCount > 0)
            sortColors(ColorPodge.construct(defaultCount))
    }, [defaultCount, colors, sortColors])
    const state = useMemo<ColorsState>(
        () => ({
            setColors,
            sortColors,
            colors: colors,
        }),
        [colors],
    )
    return (
        <ColorsContext.Provider value={state}>
            {children}
        </ColorsContext.Provider>
    )
}

export const useColors = () => useContext(ColorsContext)
