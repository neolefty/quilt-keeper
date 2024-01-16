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
    const columns = Math.min(Math.round(width / 2), maxColumns)
    const rows = Math.round((height * columns) / width)
    const maxWidthRem = 10
    // Safari & Firefox want w-auto h-full
    // Chrome & Firefox want nothing
    // TODO: manually flow & place saves using notation grid-area n / n / n / n https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area
    return (
        <button
            className={clsx(
                "save-button hover:scale-90 transition-transform duration-200 ease-in-out",
            )}
            style={{
                // gridArea: `span ${rows} / span ${columns}`,
                gridColumn: `span ${columns}`,
                gridRow: `span ${rows}`,
            }}
            onClick={() => restore(timestamp)}
        >
            <ProvideStaticPalette palette={paletteReal}>
                <svg
                    viewBox={`0 0 ${baseLength * width * 2} ${
                        baseLength * height * 2
                    }`}
                    className="w-auto h-full"
                    style={{
                        maxWidth: `${(maxWidthRem * width) / maxColumns}rem`,
                    }}
                >
                    <ShowSquare square={quilt} />
                </svg>
            </ProvideStaticPalette>
        </button>
    )
}
