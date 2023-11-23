import {
    GridOfSquares,
    isGrid,
    SingleSquare,
    Square,
    Tile,
} from "../../square/Square"
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import templates from "../../square/Templates"
import { useColors } from "../../color/state/ColorsProvider"
import { Pair } from "../../FixedLengthArrays"
import {
    createRandomQuilt,
    fillInMissingColors,
    quiltDimensions,
    redistributeColors,
} from "../quiltFunctions"

interface QuiltState {
    quilt: GridOfSquares
    setQuilt: (quilt: Square) => void
    redistributeColors: () => void
    resetPattern: () => void
}

const tni = () => {
    throw new Error("not implemented")
}

const defaultTile: Tile = {
    groupColorMap: { NaN: NaN },
    template: templates.square,
}

const defaultSquare: SingleSquare = {
    tiles: [defaultTile],
}

export const defaultQuiltState: QuiltState = {
    quilt: {
        tiles: [[defaultSquare]],
    },
    setQuilt: tni,
    redistributeColors: tni,
    resetPattern: tni,
}

const QuiltContext = createContext<QuiltState>(defaultQuiltState)

export const QuiltProvider = ({
    defaultQuiltSize = [4, 4],
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
            setQuilt: (quilt: Square) => {
                if (isGrid(quilt)) setQuilt(quilt)
                else setQuilt({ tiles: [[quilt]] })
            },
            resetPattern: () => {
                const [curWidth, curHeight] = quiltDimensions(quilt)
                setQuilt(createRandomQuilt(curWidth, curHeight, colors))
            },
            redistributeColors: () =>
                setQuilt(redistributeColors(quilt, colors)),
        }),
        [colors, quilt],
    )
    useEffect(() => {
        if (colors.length === 0 || quilt === defaultQuiltState.quilt) return
        const square = fillInMissingColors(quilt, colors)
        if (square !== quilt) quiltState.setQuilt(square)
    }, [colors, quilt, quiltState])
    return (
        <QuiltContext.Provider value={quiltState}>
            {children}
        </QuiltContext.Provider>
    )
}

export const useQuilt = () => useContext(QuiltContext)
