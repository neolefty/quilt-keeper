import {
    GridOfSquares,
    isGrid,
    Square,
    TemplatePath,
    Tile,
} from "../square/Square"
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

/** Assign random colors to all tiles in a quilt. */
const redistributeColors = (square: Square, colors: ColorPodge): Square => {
    if (isGrid(square)) {
        return {
            tiles: square.tiles.map((column) =>
                column.map((square) => redistributeColors(square, colors)),
            ),
        } as GridOfSquares // cast to reassure about non-empty arrays
    } else {
        return {
            tiles: [
                {
                    ...square.tiles[0],
                    groupColorMap: assignRandomColors(
                        square.tiles[0].template.paths,
                        colors,
                    ),
                },
            ],
        }
    }
}

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
            resetPattern: () => setQuilt(defaultQuiltState.quilt),
            redistributeColors: () =>
                setQuilt(redistributeColors(quilt, colors)),
        }),
        [colors, quilt],
    )
    return (
        <QuiltContext.Provider value={quiltState}>
            {children}
        </QuiltContext.Provider>
    )
}

const numberRange = (start: number, end: number) => {
    return Array.from({ length: end - start }, (_, i) => i + start)
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
    const tiles: Square[][] = numberRange(0, width).map(() =>
        numberRange(0, height).map(() => {
            const template = randomValue(templates)
            const tile: Tile = {
                groupColorMap: assignRandomColors(template.paths, podge),
                rotation: Math.floor(Math.random() * 4) * 90,
                template,
            }
            return {
                tiles: [tile],
            }
        }),
    )
    // annotate as non-zero length
    return { tiles } as GridOfSquares
}

function shuffle<T>(items: T[]): T[] {
    const result = [...items]
    result.forEach((_, i) => {
        const temp = result[i]
        const j = Math.floor(Math.random() * result.length)
        result[i] = result[j]
        result[j] = temp
    })
    return result
}

const assignRandomColors = (
    paths: ReadonlyArray<TemplatePath>,
    podge: ColorPodge,
): Tile["groupColorMap"] => {
    const allColors = podge.driftColors.map((c) => c.key)
    let remainingColors: number[] = []
    return Object.fromEntries(
        paths.map(({ group }) => {
            if (remainingColors.length === 0)
                remainingColors = shuffle(allColors)
            return [group, remainingColors.pop()!]
        }),
    )
}

export const useQuilt = () => useContext(QuiltContext)
