import { useSaves } from "../history/SaveProvider"
import { SidePanelH2 } from "../page/SidePanelH2"
import { RestoreQuiltButton } from "./RestoreQuiltButton"

const saveColumns = 4

export const RestorePanel = () => {
    const { saves } = useSaves()
    return (
        <>
            <hr />
            <SidePanelH2>Saves</SidePanelH2>
            <div className={`grid gap-3 grid-cols-${saveColumns}`}>
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
