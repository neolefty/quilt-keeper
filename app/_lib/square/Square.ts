import { OneByOneOrMore, OneOrMore } from "../FixedLengthArrays"

/**
 *  A quilt square that can be rendered.
 *  Either a pile of tiles, or a recursive grid of squares, laid out like this: tiles[x][y].
 *  Note that an interface is required here because of the recursive definition.
 */
export interface Square {
    tiles: OneOrMore<Tile> | OneByOneOrMore<Square>
}

/** Is it squares all the way down? */
export const isMoreSquares = (
    tiles: OneOrMore<Tile> | OneByOneOrMore<Square>,
): tiles is OneByOneOrMore<Square> => Array.isArray(tiles[0])

export interface Tile {
    // map of group to DriftColor ID
    groupColorMap: Record<number, number>
    template: Template
    rotation?: number // 0, 90, 180, 270
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
