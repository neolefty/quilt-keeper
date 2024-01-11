import { SaveRecord } from "../history/SaveRecord"
import { useSaves } from "../history/SaveProvider"
import { Palette } from "../color/Palette"
import { quiltDimensions } from "./quiltFunctions"
import { ProvideStaticPalette } from "../color/state/PaletteProvider"
import { baseLength } from "../square/Paths"
import { ShowSquare } from "./components/ShowSquare"
import { useMemo } from "react"
import clsx from "clsx"

export const RestoreQuiltButton = ({
    save: { quilt, palette, timestamp },
    maxColumns,
}: {
    save: SaveRecord
    maxColumns: number
}) => {
    const { restore } = useSaves()
    const paletteReal = useMemo(() => Palette.fromJs(palette), [palette])
    const [width, height] = quiltDimensions(quilt)
    const columns = Math.min(Math.round(width / 4), maxColumns)
    const rows = Math.round((columns * height) / width)
    return (
        <button
            className={clsx(
                "btn btn-primary m-0 p-0",
                `col-span-${columns}`,
                `row-span-${rows}`,
            )}
            onClick={() => restore(timestamp)}
        >
            <ProvideStaticPalette palette={paletteReal}>
                <svg
                    viewBox={`0 0 ${baseLength * width * 2} ${
                        baseLength * height * 2
                    }`}
                >
                    <ShowSquare square={quilt} />
                </svg>
            </ProvideStaticPalette>
        </button>
    )
}
