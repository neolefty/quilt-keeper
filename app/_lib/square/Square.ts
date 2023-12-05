import { Static, Type } from "@sinclair/typebox"

export const TemplatePathSchema = Type.Object({
    group: Type.Number(),
    svgPath: Type.String(),
    transform: Type.Optional(Type.String()),
})
export type TemplatePath = Static<typeof TemplatePathSchema>
// export interface TemplatePath {
//     group: number // corresponds to a color & layer
//     svgPath: string // assume a viewbox of -baseLength to baseLength in x & y
//     transform?: string // svg transform attribute
// }

export const TemplateSchema = Type.Object({
    name: Type.String(),
    paths: Type.Array(TemplatePathSchema, { minItems: 1 }),
})
/**
 * A shape template for a quilt square.
 * For example, it could include a square background and a couple of triangles on top.
 */
export type Template = Static<typeof TemplateSchema>
// export interface Template {
//     name: string
//     paths: ReadonlyArray<TemplatePath>
// }

export const TileSchema = Type.Object({
    groupColorMap: Type.Record(Type.Number(), Type.Number()),
    template: TemplateSchema,
    rotation: Type.Optional(Type.Number({ enum: [0, 90, 180, 270] })),
    mirror: Type.Optional(Type.Boolean()),
})
/** A layer of a quilt square. In practice, squares only have a single layer so far. */
export type Tile = Static<typeof TileSchema>
// export interface Tile {
//     // map of group to DriftColor ID
//     groupColorMap: Record<number, number>
//     template: Template
//     rotation?: number // 0, 90, 180, 270
//     mirror?: boolean
// }

export const SingleSquareSchema = Type.Object({
    tiles: Type.Array(TileSchema, { minItems: 1 }),
})
/** A quilt square that is a single pile of tiles. */
export type SingleSquare = Static<typeof SingleSquareSchema>
// export interface SingleSquare {
//     tiles: OneOrMore<Tile>
// }

export const GridOfSquaresSchema = Type.Object({
    squares: Type.Array(Type.Array(SingleSquareSchema, { minItems: 1 }), {
        minItems: 1,
    }),
})
/** A quilt square that is recursively a grid of squares. */
export type GridOfSquares = Static<typeof GridOfSquaresSchema>
// export interface GridOfSquares {
//     squares: OneByOneOrMore<Square>
// }

export const SquareSchema = Type.Union([
    SingleSquareSchema,
    GridOfSquaresSchema,
])
/**
 *  A quilt square.
 *  Polymorphic: Either a pile of tiles, or a recursive grid of squares, laid out like this: tiles[x][y].
 *  Note that an interface is required here because of the recursive definition.
 *
 *  Ahem, this polymorphism has been a pain, with lots of casting.
 */
export type Square = Static<typeof SquareSchema>
// export type Square = SingleSquare | GridOfSquares

/** Is it squares all the way down? */
export const isGrid = (square: Square): square is GridOfSquares =>
    "squares" in square

export const isSingleSquare = (square: Square): square is SingleSquare =>
    "tiles" in square

export const mapQuiltTiles = (
    quilt: Square,
    callback: (tile: Tile) => Tile,
): Square => {
    if (isGrid(quilt)) {
        return {
            squares: quilt.squares.map((row) =>
                row.map((column) => mapQuiltTiles(column, callback)),
            ) as GridOfSquares["squares"], // annotate that arrays are non-empty
        }
    } else
        return {
            tiles: quilt.tiles.map(callback) as SingleSquare["tiles"], // annotate that array is non-empty
        }
}
