import { SingleSquare } from "../../square/Square"
import {
    createContext,
    PropsWithChildren,
    useContext,
    useMemo,
    useState,
} from "react"

interface EditSquareState {
    editingSquare?: SingleSquare
    setEditingSquare: (square?: SingleSquare) => void
    cancelEditingSquare: () => void
}

const tni = () => {
    throw new Error("not implemented")
}

const defaultEditSquareState: EditSquareState = {
    setEditingSquare: tni,
    cancelEditingSquare: tni,
}

const EditSquareContext = createContext(defaultEditSquareState)

/**
 * What square, if any, is currently being edited?
 * So far only colors are edited.
 * Future: Control zoom as well.
 */
export const EditSquareProvider = ({ children }: PropsWithChildren<{}>) => {
    const [editing, setEditing] = useState<SingleSquare>()
    const state = useMemo<EditSquareState>(
        () => ({
            editingSquare: editing,
            setEditingSquare: setEditing,
            cancelEditingSquare: () => setEditing(undefined),
        }),
        [editing],
    )
    return (
        <EditSquareContext.Provider value={state}>
            {children}
        </EditSquareContext.Provider>
    )
}

export const useEditSquare = () => useContext(EditSquareContext)
