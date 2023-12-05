import { GridOfSquaresSchema } from "../square/Square"
import { PaletteJsSchema } from "../color/Palette"
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { Static, Type } from "@sinclair/typebox"
import { usePalette } from "../color/state/PaletteProvider"
import { useQuilt } from "../quilt/state/QuiltProvider"

export const SaveRecordSchema = Type.Object({
    palette: PaletteJsSchema,
    quilt: GridOfSquaresSchema,
    version: Type.Number(),
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
// }

interface RestoreRecord extends SaveRecord {
    timestamp: number
}

interface SaveContextState {
    // All known saves, most recent first
    saves: ReadonlyArray<RestoreRecord>
    // save the current state of the app
    save: () => void
    // reopen the saved state with the given timestamp
    restore: (timestamp: number) => void
}

const tni = () => {
    throw new Error("not implemented")
}

const defaultSaveState: SaveContextState = {
    saves: [],
    save: tni,
    restore: tni,
}

const SaveContext = createContext<SaveContextState>(defaultSaveState)

export const SaveProvider = ({ children }: PropsWithChildren) => {
    const { palette, setPalette } = usePalette()
    const { quilt, setQuilt } = useQuilt()
    const [saves, setSaves] = useState<ReadonlyArray<RestoreRecord>>([])
    const savingRef = useRef(false)
    useEffect(() => {
        const listener = () => {
            if (!savingRef.current) setSaves(loadSavesFromLocalStorage())
        }
        window.addEventListener("storage", listener)
        return () => window.removeEventListener("storage", listener)
    }, [])
    const saveState = useMemo<SaveContextState>(
        () => ({
            saves,
            save: () => {
                if (savingRef.current) {
                    console.warn("already saving")
                    return
                }
                try {
                    savingRef.current = true
                    // TODO debounce (don't save if no changes)
                    const newSaves = [
                        {
                            palette: palette.toJs(),
                            quilt,
                            version: 1,
                            timestamp: Date.now(),
                        },
                        ...saves,
                    ]
                    localStorage.setItem("saves", JSON.stringify(newSaves))
                    setSaves(newSaves)
                } finally {
                    savingRef.current = false
                }
            },
            restore: (timestamp: number) => {
                const record = saves.find(
                    (save) => save.timestamp === timestamp,
                )
                if (!record) throw new Error("no such save")
                setPalette(PaletteJsSchema.parse(record.palette))
                setQuilt(record.quilt)
            },
        }),
        [palette, quilt, saves, setPalette, setQuilt],
    )
    return (
        <SaveContext.Provider value={saveState}>
            {children}
        </SaveContext.Provider>
    )
}

const loadSavesFromLocalStorage = (): ReadonlyArray<RestoreRecord> => {
    const saves = localStorage.getItem("saves")
    if (!saves) return []
    const array = JSON.parse(saves)
    if (!Array.isArray(array)) {
        console.error("localStorage value 'saves' is not an array", { saves })
        return []
    }
    return JSON.parse(saves)
}

export const useSaves = () => useContext(SaveContext)
