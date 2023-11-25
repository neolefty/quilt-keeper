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
import { usePalette } from "../../color/state/PaletteProvider"
import { Pair } from "../../FixedLengthArrays"
import {
    createRandomQuilt,
    fillInMissingColors,
    quiltDimensions,
    redistributeColors,
} from "../quiltFunctions"
import { useSizeFromUrlParams } from "../../useSizeFromUrlParams"

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
    defaultQuiltSize,
    children,
}: PropsWithChildren<{ defaultQuiltSize?: Pair<number> }>) => {
    const { palette } = usePalette()
    const [quilt, setQuilt] = useState(defaultQuiltState.quilt)
    const [width, height] = useSizeFromUrlParams(defaultQuiltSize)
    useEffect(() => {
        if (quilt === defaultQuiltState.quilt && palette.length > 0)
            setQuilt(createRandomQuilt(width, height, palette))
    }, [width, height, palette, quilt])
    const quiltState: QuiltState = useMemo(
        () => ({
            quilt,
            setQuilt: (quilt: Square) => {
                if (isGrid(quilt)) setQuilt(quilt)
                else setQuilt({ tiles: [[quilt]] })
            },
            resetPattern: () => {
                const [curWidth, curHeight] = quiltDimensions(quilt)
                setQuilt(createRandomQuilt(curWidth, curHeight, palette))
            },
            redistributeColors: () =>
                setQuilt(redistributeColors(quilt, palette)),
        }),
        [palette, quilt],
    )
    useEffect(() => {
        if (palette.length === 0 || quilt === defaultQuiltState.quilt) return
        const square = fillInMissingColors(quilt, palette)
        if (square !== quilt) quiltState.setQuilt(square)
    }, [palette, quilt, quiltState])
    return (
        <QuiltContext.Provider value={quiltState}>
            {children}
        </QuiltContext.Provider>
    )
}

export const useQuilt = () => useContext(QuiltContext)
