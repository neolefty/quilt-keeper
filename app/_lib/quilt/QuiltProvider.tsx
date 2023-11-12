import { Square, Tile } from "../square/Square"
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import templates from "../square/Templates"
import { useColorPodge } from "../color/state/ColorsProvider"
import { Pair } from "../FixedLengthArrays"
import { ColorPodge } from "../color/ColorPodge"

interface QuiltState {
    quilt: Square
    setQuilt: (quilt: Square) => void
    resetQuilt: () => void
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
    setQuilt: () => {
        throw new Error("not implemented")
    },
    resetQuilt: () => {
        throw new Error("not implemented")
    },
}

const QuiltContext = createContext<QuiltState>(defaultQuiltState)

export const QuiltProvider = ({
    defaultQuiltSize = [3, 5],
    children,
}: PropsWithChildren<{ defaultQuiltSize?: Pair<number> }>) => {
    const { colors } = useColorPodge()
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
            resetQuilt: () => setQuilt(defaultQuiltState.quilt),
        }),
        [quilt],
    )
    return (
        <QuiltContext.Provider value={quiltState}>
            {children}
        </QuiltContext.Provider>
    )
}

const numberRange = (start: number, end: number) => {
    return Array.from({ length: end - start }, (_, i) => start)
}

function randomValue<T>(items: Record<string, T>): T {
    const keys = Object.keys(items)
    return items[keys[Math.floor(keys.length * Math.random())]]
}

const createRandomQuilt = (
    width: number,
    height: number,
    podge: ColorPodge,
): Square => {
    if (width < 1 || height < 1)
        throw new Error(
            `Quilt must be at least 1x1 — received ${width}x${height}}`,
        )
    // TypeScript doesn't quite figure out that the arrays are guaranteed to be non-zero-length,
    // but we can at least rely on it to ensure it's an array of arrays of Squares.
    const tiles: Square[][] = numberRange(0, width).map((x) =>
        numberRange(0, height).map((y) => {
            const template = randomValue(templates)
            const tile: Tile = {
                groupColorMap: Object.fromEntries(
                    template.paths.map(({ group }) => [
                        group,
                        podge.pickRandom().key,
                    ]),
                ),
                template,
            }
            return {
                tiles: [tile],
            }
        }),
    )
    return {
        tiles: tiles as Square["tiles"],
    }
}

export const useQuilt = () => useContext(QuiltContext)
