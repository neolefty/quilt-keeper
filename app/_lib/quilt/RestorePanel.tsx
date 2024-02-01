import { useSaves } from "../history/SaveProvider"
import { SidePanelH2 } from "../page/SidePanelH2"
import { RestoreQuiltButton } from "./RestoreQuiltButton"

const saveColumns = 6

export const RestorePanel = () => {
    const { saves } = useSaves()
    const minHeight = Math.min((saves?.length || 0) * 2, 10)
    return (
        <>
            <hr />
            <SidePanelH2>Saves</SidePanelH2>
            <div
                // max-w-full
                // Chrome & Safari have a little trouble with this layout, I think because the restore buttons can be
                // different widths. A little truncation won't hurt anyone here, right?
                className={`grid overflow-y-auto gap-3 grid-cols-${saveColumns} overflow-x-hidden`}
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
