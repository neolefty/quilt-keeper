import { useSaves } from "../history/SaveProvider"
import { SidePanelH2 } from "../page/SidePanelH2"
import { RestoreQuiltButton } from "./RestoreQuiltButton"

const saveColumns = 4

export const RestorePanel = () => {
    const { saves } = useSaves()
    const minHeight = Math.min((saves?.length || 0) * 2, 10)
    return (
        <>
            <hr />
            <SidePanelH2>Saves</SidePanelH2>
            <div
                className={`grid overflow-y-auto gap-3 grid-cols-${saveColumns}`}
                style={{
                    minHeight: `${minHeight}rem`,
                    // leave room for the rest of the left-side panel
                    maxHeight: `calc(100vh - 30rem)`,
                }}
            >
                {saves.map((save, idx) => (
                    <RestoreQuiltButton
                        save={save}
                        key={idx}
                        maxColumns={saveColumns}
                    />
                ))}
            </div>
        </>
    )
}
