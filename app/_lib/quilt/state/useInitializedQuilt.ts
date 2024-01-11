import { useEffect } from "react"
import stringify from "fast-json-stable-stringify"
import { Pair } from "../../FixedLengthArrays"
import { usePalette } from "../../color/state/PaletteProvider"
import { useSizeFromUrlParams } from "../../page/useSizeFromUrlParams"
import { SaveRecordSchema, toSaveRecord } from "../../history/SaveRecord"
import { Palette } from "../../color/Palette"
import { createRandomQuilt } from "../quiltFunctions"
import { defaultQuiltState, QuiltState } from "./QuiltProvider"
import { Value } from "@sinclair/typebox/value"

// on initial load, create a random quilt or restore from local storage
export const useInitializedQuilt = (
    quiltState: QuiltState,
    defaultQuiltSize?: Pair<number>,
) => {
    const { palette, setPalette } = usePalette()
    const { quilt, setQuilt } = quiltState
    const [width, height] = useSizeFromUrlParams(defaultQuiltSize)
    useEffect(() => {
        if (quilt === defaultQuiltState.quilt && palette.length > 0) {
            let restored = false
            const latestQuiltString = localStorage.getItem("latestQuilt")
            if (latestQuiltString) {
                try {
                    const result = JSON.parse(latestQuiltString)
                    if (Value.Check(SaveRecordSchema, result)) {
                        setQuilt(result.quilt, true)
                        setPalette(Palette.fromJs(result.palette), true)
                    }
                    restored = true
                } catch (e) {
                    console.warn("failed to load latest quilt", {
                        latestQuiltString,
                        e,
                    })
                }
            }
            if (!restored)
                setQuilt(createRandomQuilt(width, height, palette), true)
        }
    }, [width, height, palette, quilt, setPalette, setQuilt])

    useEffect(() => {
        if (quilt !== defaultQuiltState.quilt && palette.length > 0)
            localStorage.setItem(
                "latestQuilt",
                stringify(toSaveRecord(palette, quilt)),
            )
    }, [palette, quilt])
}
