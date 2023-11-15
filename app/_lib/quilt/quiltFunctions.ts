import { ColorPodge } from "../color/ColorPodge"
import {
    GridOfSquares,
    isGrid,
    mapQuiltTiles,
    SingleSquare,
    Square,
    TemplatePath,
    Tile,
} from "../square/Square"
import templates from "../square/Templates"

/** Assign random colors to all tiles in a quilt. */
export const redistributeColors = (
    square: Square,
    colors: ColorPodge,
): Square => {
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
export const numberRange = (start: number, end: number) => {
    return Array.from({ length: end - start }, (_, i) => i + start)
}

function randomValue<T>(items: Record<string, T>): T {
    const keys = Object.keys(items)
    return items[keys[Math.floor(keys.length * Math.random())]]
}

/**
 * Sometimes colors are removed; when that happens, fill in with random colors.
 * If no change, return the original square.
 * TODO prefer colors that aren't already in the tile.
 */
export const fillInMissingColors = (
    square: Square,
    colors: ColorPodge,
): Square => {
    let changed = false
    const result = mapQuiltTiles(square, (tile) => {
        const missing = Object.values(tile.groupColorMap).some(
            (key) => colors.byKey.get(key) === undefined,
        )
        if (missing) {
            changed = true
            return {
                ...tile,
                groupColorMap: Object.fromEntries(
                    Object.entries(tile.groupColorMap).map(([group, key]) => [
                        group,
                        colors.byKey.get(key) ? key : colors.pickRandom().key,
                    ]),
                ),
            }
        } else return tile
    })
    if (changed) return result
    else return square
}
export const createRandomQuilt = (
    width: number,
    height: number,
    colors: ColorPodge,
): Square => {
    if (width < 1 || height < 1)
        throw new Error(
            `Quilt must be at least 1x1 — received ${width}x${height}}`,
        )
    // TypeScript doesn't quite figure out that the arrays are guaranteed to be non-zero-length,
    // but we can at least rely on it to ensure it's an array of arrays of Squares.
    const tiles: Square[][] = numberRange(0, width).map(() =>
        numberRange(0, height).map(() => createRandomSquare(colors)),
    )
    // annotate as non-zero length
    return { tiles } as GridOfSquares
}
export const createRandomSquare = (podge: ColorPodge): SingleSquare => {
    const template = randomValue(templates)
    const tile: Tile = {
        groupColorMap: assignRandomColors(template.paths, podge),
        rotation: Math.floor(Math.random() * 4) * 90,
        template,
    }
    return {
        tiles: [tile],
    }
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

export type Side = "top" | "right" | "bottom" | "left"

export const addStripe = (
    quilt: GridOfSquares,
    side: Side,
    colors: ColorPodge,
): GridOfSquares => {
    const width = quilt.tiles.length
    const height = quilt.tiles[0].length
    const newStripe = numberRange(
        0,
        side === "top" || side === "bottom" ? width : height,
    ).map(() => createRandomSquare(colors))
    const tiles = [
        ...(side === "left" ? [newStripe] : []),
        ...quilt.tiles,
        ...(side === "right" ? [newStripe] : []),
    ]
    if (side === "top") tiles.forEach((row, idx) => row.unshift(newStripe[idx]))
    if (side === "bottom") tiles.forEach((row, idx) => row.push(newStripe[idx]))
    return { tiles } as GridOfSquares
}
