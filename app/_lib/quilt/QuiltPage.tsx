"use client"

import { PaletteProvider } from "../color/state/PaletteProvider"
import { QuiltControls } from "../color/components/QuiltControls"
import { QuiltProvider } from "./state/QuiltProvider"
import { ShowQuilt } from "./components/ShowQuilt"
import { EditSquareProvider } from "./state/EditSquareProvider"
import { useRef, useState } from "react"
import { HistoryProvider } from "../history/HistoryProvider"
import { SaveProvider } from "../history/SaveProvider"
import { RestorePanel } from "./RestorePanel"
import { AppTitle } from "../page/AppTitle"

export const QuiltPage = ({ initialTitle }: { initialTitle: string }) => {
    const [title, setTitle] = useState(initialTitle)
    const serialRef = useRef<[number]>([0])

    return (
        <PaletteProvider serial={serialRef.current}>
            <QuiltProvider serial={serialRef.current}>
                <SaveProvider>
                    <HistoryProvider>
                        <EditSquareProvider>
                            <div className="flex flex-row h-full">
                                <div className="bg-base-200 px-3 h-full max-h-screen min-w-fit flex flex-col gap-3">
                                    <AppTitle initialTitle={title} />
                                    <QuiltControls />
                                    <RestorePanel />
                                </div>
                                <div className="bg-base-100 w-full h-full">
                                    <ShowQuilt />
                                </div>
                            </div>
                        </EditSquareProvider>
                    </HistoryProvider>
                </SaveProvider>
            </QuiltProvider>
        </PaletteProvider>
    )
}
