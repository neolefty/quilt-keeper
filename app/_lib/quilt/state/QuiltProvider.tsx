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
    // if true, overwrite the previous state in undo history
    clobber: boolean
    // global state sequence (used for undo, with clobber)
    serial: number

    setQuilt: (quilt: Square, clobber?: boolean) => void
    redistributeColors: (clobber?: boolean) => void
    resetPattern: (clobber?: boolean) => void
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
        squares: [[defaultSquare]],
    },
    clobber: false,
    serial: NaN,
    setQuilt: tni,
    redistributeColors: tni,
    resetPattern: tni,
}

const QuiltContext = createContext<QuiltState>(defaultQuiltState)

export const QuiltProvider = ({
    defaultQuiltSize,
    // a way to put all state changes into a global sequence -- increment and include in state on each change
    serial,
    children,
}: PropsWithChildren<{
    defaultQuiltSize?: Pair<number>
    serial: [number]
}>) => {
    const { palette } = usePalette()
    const [{ quilt, clobber }, setQuilt] = useState({
        quilt: defaultQuiltState.quilt,
        clobber: false,
    })
    const [width, height] = useSizeFromUrlParams(defaultQuiltSize)
    useEffect(() => {
        if (quilt === defaultQuiltState.quilt && palette.length > 0) {
            setQuilt({
                quilt: createRandomQuilt(width, height, palette),
                clobber: true,
            })
        }
    }, [width, height, palette, quilt])
    // separate memo of static state items to avoid updating serial number when palette changes
    const staticQuilt = useMemo(
        () => ({
            quilt,
            clobber,
            serial: serial[0]++,
        }),
        [clobber, quilt, serial],
    )
    const quiltState: QuiltState = useMemo(
        () => ({
            ...staticQuilt,
            setQuilt: (quilt: Square, clobber = false) => {
                if (isGrid(quilt)) setQuilt({ quilt, clobber })
                else setQuilt({ quilt: { squares: [[quilt]] }, clobber })
            },
            resetPattern: (clobber = false) => {
                const [curWidth, curHeight] = quiltDimensions(quilt)
                setQuilt({
                    quilt: createRandomQuilt(curWidth, curHeight, palette),
                    clobber,
                })
            },
            redistributeColors: (clobber = false) => {
                setQuilt({
                    quilt: redistributeColors(quilt, palette),
                    clobber,
                })
            },
        }),
        [palette, quilt, staticQuilt],
    )
    // when a color is removed from the palette, re-color affected tiles
    useEffect(() => {
        if (palette.length === 0 || quilt === defaultQuiltState.quilt) return
        const square = fillInMissingColors(quilt, palette)
        if (square !== quilt) quiltState.setQuilt(square, true)
    }, [palette, quilt, quiltState])
    return (
        <QuiltContext.Provider value={quiltState}>
            {children}
        </QuiltContext.Provider>
    )
}

export const useQuilt = () => useContext(QuiltContext)
