import { Palette } from "../../color/Palette"
import { GridOfSquares } from "../../square/Square"
import { defaultQuiltState, useQuilt } from "./QuiltProvider"
import { usePalette } from "../../color/state/PaletteProvider"
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"

interface HistoryEntry {
    palette: Palette
    quilt: GridOfSquares
}

interface HistoryState {
    history: ReadonlyArray<HistoryEntry>
    historyIndex: number
}

interface HistoryContextType extends HistoryState {
    maxUndo: number
    maxRedo: number
    // time travel to a specific point in history
    setHistoryIndex: (historyIndex: number) => void
    // time travel, but relative — negative is undo (back in time), positive is redo (forward)
    setHistoryRelative: (historyDelta: number) => void
}

const tni = () => {
    throw new Error("not implemented")
}

const defaultHistoryState: HistoryState = {
    history: [],
    historyIndex: -1,
}

const defaultHistoryContext: HistoryContextType = {
    ...defaultHistoryState,
    maxUndo: NaN,
    maxRedo: NaN,
    setHistoryIndex: tni,
    setHistoryRelative: tni,
}

const HistoryContext = createContext(defaultHistoryContext)

export const HistoryProvider = ({ children }: PropsWithChildren<{}>) => {
    const { palette, setPalette } = usePalette()
    const { quilt, setQuilt } = useQuilt()
    const isUpdatingRef = useRef(false)
    const [history, setHistory] = useState(defaultHistoryState)

    // Push a new history entry whenever quilt or colors updates
    useEffect(() => {
        // Don't push a new history entry if:
        //  * we're in the middle of updating history
        //  * there are no colors (because they will be automatically regenerated  with a useEffect)
        //  * the quilt is uninitialized (because it will be automatically initialized with a useEffect)
        if (
            !isUpdatingRef.current &&
            palette.length > 0 &&
            quilt !== defaultQuiltState.quilt
        ) {
            const historyIndex = history.historyIndex + 1
            console.debug(
                `incrementing history from ${history.historyIndex} to ${historyIndex}`,
            )
            setHistory({
                ...history,
                history: [
                    ...history.history.slice(0, historyIndex),
                    {
                        palette: palette,
                        quilt,
                    },
                ],
                historyIndex,
            })
        } else console.debug("skipping history update increment")
        // Note: Omitting history from dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [palette, quilt])

    const state = useMemo<HistoryContextType>(() => {
        const setHistoryIndex = (historyIndex: number) => {
            // no effect if we're currently updating, to avoid stepping on toes
            if (isUpdatingRef.current) {
                console.debug("skipping concurrent undo/redo")
                return
            }
            isUpdatingRef.current = true
            try {
                const { palette, quilt } = history.history[historyIndex]
                const newHistory = {
                    history: history.history,
                    historyIndex,
                }
                console.debug({
                    currentHistoryIndex: history.historyIndex,
                    newHistoryIndex: historyIndex,
                    newEntry: history.history[historyIndex],
                    newHistory,
                })
                setHistory(newHistory)
                setPalette(palette)
                setQuilt(quilt)
            } finally {
                // Do this after side effects fire. Dang, this is a kludge.
                setTimeout(() => {
                    isUpdatingRef.current = false
                }, 0)
            }
        }
        // todo move historyIndex to a ref?
        return {
            ...history,
            setHistoryIndex,
            setHistoryRelative: (historyDelta: number) => {
                console.debug(
                    `changing history by ${historyDelta}, from ${
                        history.historyIndex
                    } to ${history.historyIndex + historyDelta}`,
                )
                setHistoryIndex(history.historyIndex + historyDelta)
            },
            maxUndo: history.historyIndex,
            maxRedo: history.history.length - history.historyIndex - 1,
        }
    }, [setPalette, setQuilt, history])

    return (
        <HistoryContext.Provider value={state}>
            {children}
        </HistoryContext.Provider>
    )
}

export const useHistory = () => useContext(HistoryContext)
