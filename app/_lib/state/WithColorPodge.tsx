import { ColorPodge } from "../color/ColorPodge"
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"

interface ColorPodgeState {
    podge: ColorPodge
    sortPodge: (podge: ColorPodge) => void
    setPodge: (podge: ColorPodge) => void
}

const DEFAULT_STATE: ColorPodgeState = {
    podge: new ColorPodge(),
    sortPodge: () => {
        throw new Error("not implemented")
    },
    setPodge: () => {
        throw new Error("not implemented")
    },
}

const ColorPodgeContext = createContext(DEFAULT_STATE)

export const WithColorPodge = ({
    defaultCount = 3,
    children,
}: PropsWithChildren<{
    defaultCount?: number
}>) => {
    const [podge, setPodge] = useState(new ColorPodge())
    const sortPodge = useCallback((newPodge: ColorPodge) => {
        const sortedPodge = newPodge.sort((a, b) => a.hue - b.hue)
        setPodge(sortedPodge)
    }, [])
    useEffect(() => {
        // start with three colors
        if (podge.length === 0 && defaultCount > 0) {
            let newPodge = podge
            while (newPodge.length < defaultCount)
                newPodge = newPodge.addRandomColor()
            sortPodge(newPodge)
        }
    }, [defaultCount, podge, sortPodge])
    const state = useMemo<ColorPodgeState>(
        () => ({
            setPodge,
            sortPodge,
            podge,
        }),
        [podge],
    )
    return (
        <ColorPodgeContext.Provider value={state}>
            {children}
        </ColorPodgeContext.Provider>
    )
}

export const useColorPodge = () => useContext(ColorPodgeContext)
