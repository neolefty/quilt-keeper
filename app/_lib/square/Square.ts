import { OneByOneOrMore, OneOrMore } from "../FixedLengthArrays"

/** A quilt square that is a single pile of tiles. */
export interface SingleSquare {
    tiles: OneOrMore<Tile>
}

/** A quilt square that is recursively a grid of squares. */
export interface GridOfSquares {
    tiles: OneByOneOrMore<Square>
}

/**
 *  A quilt square that can be rendered.
 *  Either a pile of tiles, or a recursive grid of squares, laid out like this: tiles[x][y].
 *  Note that an interface is required here because of the recursive definition.
 */
export type Square = SingleSquare | GridOfSquares

/** Is it squares all the way down? */
export const isGrid = (square: Square): square is GridOfSquares =>
    Array.isArray(square.tiles[0])

export interface Tile {
    // map of group to DriftColor ID
    groupColorMap: Record<number, number>
    template: Template
    rotation?: number // 0, 90, 180, 270
    mirror?: boolean
    // scale?: number
    // tiles: Template[][] // grid of templates
    // tiles: Square[][]? // recursively map the colors?
}

export interface Template {
    name: string
    paths: ReadonlyArray<TemplatePath>
}

export interface TemplatePath {
    group: number // corresponds to a color & layer
    svgPath: string // assume a viewbox of -baseLength to baseLength in x & y
    transform?: string // svg transform attribute
}

export const mapQuiltTiles = (
    quilt: Square,
    callback: (tile: Tile) => Tile,
): Square => {
    if (isGrid(quilt)) {
        return {
            tiles: quilt.tiles.map((row) =>
                row.map((column) => mapQuiltTiles(column, callback)),
            ) as GridOfSquares["tiles"], // annotate that arrays are non-empty
        }
    } else
        return {
            tiles: quilt.tiles.map(callback) as SingleSquare["tiles"], // annotate that array is non-empty
        }
}
