import stringify from "fast-json-stable-stringify"
import { Palette } from "../color/Palette"
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
import { Value } from "@sinclair/typebox/value"
import { usePalette } from "../color/state/PaletteProvider"
import { useQuilt } from "../quilt/state/QuiltProvider"
import { SaveRecord, SaveRecordSchema, toSaveRecord } from "./SaveRecord"

// The state saved in localStorage["saves"]
const FullSaveSchema = Type.Array(SaveRecordSchema)

type FullSave = Static<typeof FullSaveSchema>

interface SaveContextState {
    // All known saves, most recent first
    saves: ReadonlyArray<SaveRecord>
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
    const [saves, setSaves] = useState<FullSave>([])
    const savingRef = useRef(false)
    useEffect(() => {
        const listener = () => {
            if (!savingRef.current) setSaves(loadSavesFromLocalStorage())
        }
        window.addEventListener("storage", listener)
        // initial load
        setSaves(loadSavesFromLocalStorage())
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
                    const newRecord = toSaveRecord(palette, quilt)
                    const prevRecord = saves[0]
                    let isDuplicate = false
                    if (prevRecord) {
                        const prevRecordCompare = {
                            ...prevRecord,
                            timestamp: newRecord.timestamp,
                        }
                        if (
                            stringify(prevRecordCompare) ===
                            stringify(newRecord)
                        ) {
                            console.debug("not saving duplicate record", {
                                prevRecord,
                                newRecord,
                            })
                            isDuplicate = true
                        }
                    }
                    if (!isDuplicate) {
                        const newSaves = [newRecord, ...saves]
                        localStorage.setItem("saves", stringify(newSaves))
                        setSaves(newSaves)
                    }
                } finally {
                    savingRef.current = false
                }
            },
            restore: (timestamp: number) => {
                const record = saves.find(
                    (save) => save.timestamp === timestamp,
                )
                if (!record) throw new Error("no such save")
                setPalette(Palette.fromJs(record.palette))
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

const loadSavesFromLocalStorage = (): FullSave => {
    const saves = localStorage.getItem("saves")
    if (!saves) return []
    try {
        const result = JSON.parse(saves)
        if (Value.Check(FullSaveSchema, result)) return result
        return result
    } catch (e) {
        console.warn("failed to load saves", { saves, e })
        return []
    }
}

export const useSaves = () => useContext(SaveContext)
