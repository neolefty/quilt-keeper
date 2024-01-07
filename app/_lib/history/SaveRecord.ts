import { Palette, PaletteJsSchema } from "../color/Palette"
import { GridOfSquares, GridOfSquaresSchema } from "../square/Square"
import { Static, Type } from "@sinclair/typebox"

export const SaveRecordSchema = Type.Object({
    palette: PaletteJsSchema,
    quilt: GridOfSquaresSchema,
    version: Type.Number(),
    timestamp: Type.Number(),
})

/**
 * A record of a quilt design, as a plain JS object that can be serialized
 * to JSON and validated by TypeBox.
 */
export type SaveRecord = Static<typeof SaveRecordSchema>

// interface SaveRecord {
//     palette: PaletteJS
//     quilt: GridOfSquares
//     version: number
//     timestamp: number
// }

export const toSaveRecord = (
    palette: Palette,
    quilt: GridOfSquares,
): SaveRecord => {
    return {
        palette: palette.toJs(),
        quilt,
        version: 1,
        timestamp: Date.now(),
    }
}
