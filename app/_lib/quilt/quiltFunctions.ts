import { Palette } from "../color/Palette"
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
import { OneOrMore } from "../FixedLengthArrays"
import { DriftColor } from "../color/DriftColor"

type GridOrSingle<T extends Square> = T extends GridOfSquares
    ? GridOfSquares
    : SingleSquare

/** Assign random colors to all tiles in a quilt. */
export const redistributeColors = <T extends Square>(
    square: T,
    palette: Palette,
): GridOrSingle<T> => {
    if (isGrid(square)) {
        return {
            squares: square.squares.map((column) =>
                column.map((square) => redistributeColors(square, palette)),
            ),
        } as GridOrSingle<T> // cast to reassure about non-empty arrays and due to limitations of TypeScript
        // See https://stackoverflow.com/questions/70553130/typescript-generic-conditional-type-as-return-value-for-generic-function
        // Another option that I couldn't get to work involves a second generic type parameter:
        // https://dev.to/zirkelc/how-to-return-different-types-from-functions-in-typescript-2a2h
        // The problem: <T, R = GridOrSingle<T>> means R *defaults* to GridOrSingle<T> but really could be anything.
    } else {
        return {
            tiles: [
                {
                    ...square.tiles[0],
                    groupColorMap: assignRandomColors(
                        square.tiles[0].template.paths,
                        palette,
                    ),
                },
            ],
        } as SingleSquare as GridOrSingle<T>
    }
}

export const numberRange = (start: number, end?: number) => {
    const [realStart, realEnd] = end === undefined ? [0, start] : [start, end]
    return Array.from({ length: realEnd - realStart }, (_, i) => i + realStart)
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
    palette: Palette,
): Square => {
    let changed = false
    const result = mapQuiltTiles(square, (tile) => {
        const missing = Object.values(tile.groupColorMap).some(
            (key) => palette.byKey.get(key) === undefined,
        )
        if (missing) {
            changed = true
            return {
                ...tile,
                groupColorMap: Object.fromEntries(
                    Object.entries(tile.groupColorMap).map(([group, key]) => [
                        group,
                        palette.byKey.get(key) ? key : palette.pickRandom().key,
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
    palette: Palette,
): GridOfSquares => {
    if (width < 1 || height < 1)
        throw new Error(
            `Quilt must be at least 1x1 — received ${width}x${height}}`,
        )
    // TypeScript doesn't quite figure out that the arrays are guaranteed to be non-zero-length,
    // but we can at least rely on it to ensure it's an array of arrays of Squares.
    const squares: Square[][] = numberRange(width).map(() =>
        numberRange(height).map(() => createRandomSquare(palette)),
    )
    // annotate as non-zero length
    return { squares } as GridOfSquares
}
export const createRandomSquare = (palette: Palette): SingleSquare => {
    const template = randomValue(templates)
    const tile: Tile = {
        groupColorMap: assignRandomColors(template.paths, palette),
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
    palette: Palette,
): Tile["groupColorMap"] => {
    const allColors = palette.driftColors.map((c) => c.key)
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
    palette: Palette,
): GridOfSquares => {
    // start with a copy
    const squares = [
        ...quilt.squares.map((column) => [...column]),
    ] as GridOfSquares["squares"]

    // create a stripe of random squares
    const width = quilt.squares.length
    const height = quilt.squares[0].length
    const newStripe = numberRange(
        0,
        side === "top" || side === "bottom" ? width : height,
    ).map(() => createRandomSquare(palette))

    // add it to the right part of the quilt
    if (side === "left") squares.unshift(newStripe)
    if (side === "right") squares.push(newStripe)
    if (side === "top")
        squares.forEach((row, idx) => row.unshift(newStripe[idx]))
    if (side === "bottom")
        squares.forEach((row, idx) => row.push(newStripe[idx]))

    return { squares } as GridOfSquares
}

export const removeStripe = (
    quilt: GridOfSquares,
    side: Side,
): GridOfSquares => {
    // start with a copy
    const squares = [
        ...quilt.squares.map((column) => [...column]),
    ] as GridOfSquares["squares"]

    // remove the stripe
    if (side === "left") squares.shift()
    if (side === "right") squares.pop()
    if (side === "top") squares.forEach((row) => row.shift())
    if (side === "bottom") squares.forEach((row) => row.pop())

    return { squares } as GridOfSquares
}

export const quiltDimensions = (quilt: Square) =>
    isGrid(quilt) ? [quilt.squares.length, quilt.squares[0].length] : [1, 1]

/**
 * Add a new color to random tiles in a quilt.
 * @param quilt
 * @param odds 1 in odds chance of changing a tile
 * @param newColor
 */
export const stirInNewColor = (
    quilt: Square,
    odds: number,
    newColor: DriftColor,
) =>
    mapQuiltTiles(quilt, (tile) => {
        let changed = false
        const newGroupColorMap = Object.fromEntries(
            Object.entries(tile.groupColorMap).map(([group, colorKey]) => {
                // if there are 6 colors, set 1 out of 6 tiles to the new color
                if (Math.random() * odds < 1) {
                    changed = true
                    return [group, newColor.key]
                } else return [group, colorKey]
            }),
        )
        return changed ? { ...tile, groupColorMap: newGroupColorMap } : tile
    })
