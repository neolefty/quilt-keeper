import { Square } from "../square/Square"
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import templates from "../square/Templates"
import { useColors } from "../color/state/ColorsProvider"
import { Pair } from "../FixedLengthArrays"
import {
    createRandomQuilt,
    fillInMissingColors,
    redistributeColors,
} from "./quiltFunctions"

interface QuiltState {
    quilt: Square
    setQuilt: (quilt: Square) => void
    redistributeColors: () => void
    resetPattern: () => void
}

const tni = () => {
    throw new Error("not implemented")
}

const defaultQuiltState: QuiltState = {
    quilt: {
        tiles: [
            {
                groupColorMap: { NaN: NaN },
                template: templates.square,
            },
        ],
    },
    setQuilt: tni,
    redistributeColors: tni,
    resetPattern: tni,
}

const QuiltContext = createContext<QuiltState>(defaultQuiltState)

export const QuiltProvider = ({
    defaultQuiltSize = [3, 5],
    children,
}: PropsWithChildren<{ defaultQuiltSize?: Pair<number> }>) => {
    const { colors } = useColors()
    const [quilt, setQuilt] = useState(defaultQuiltState.quilt)
    const [width, height] = defaultQuiltSize
    useEffect(() => {
        if (quilt === defaultQuiltState.quilt && colors.length > 0)
            setQuilt(createRandomQuilt(width, height, colors))
    }, [width, height, colors, quilt])
    const quiltState: QuiltState = useMemo(
        () => ({
            quilt,
            setQuilt,
            resetPattern: () => setQuilt(defaultQuiltState.quilt),
            redistributeColors: () =>
                setQuilt(redistributeColors(quilt, colors)),
        }),
        [colors, quilt],
    )
    useEffect(() => {
        if (colors.length === 0 || quilt === defaultQuiltState.quilt) return
        const square = fillInMissingColors(quilt, colors)
        if (square !== quilt) setQuilt(square)
    }, [colors, quilt])
    return (
        <QuiltContext.Provider value={quiltState}>
            {children}
        </QuiltContext.Provider>
    )
}

export const useQuilt = () => useContext(QuiltContext)
