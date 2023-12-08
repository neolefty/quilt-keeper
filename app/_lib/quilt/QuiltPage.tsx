"use client"

import { PaletteProvider } from "../color/state/PaletteProvider"
import { QuiltControls } from "../color/components/QuiltControls"
import { QuiltProvider } from "./state/QuiltProvider"
import { ShowQuilt } from "./components/ShowQuilt"
import { EditSquareProvider } from "./state/EditSquareProvider"
import { HistoryProvider } from "../history/HistoryProvider"
import { useEffect, useRef, useState } from "react"
import { randomTitle } from "../../Titles"
import { SvgIconButton } from "../color/components/SvgIconButton"
import { SaveProvider, useSaves } from "../history/SaveProvider"

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
                                <div className="bg-base-200 px-3 h-full min-w-fit flex flex-col gap-3">
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

const AppTitle = ({ initialTitle }: { initialTitle: string }) => {
    const [title, setTitle] = useState(initialTitle)
    const updateTitle = (newTitle: string) => {
        setTitle(newTitle)
        const titleElement = (document.getElementsByTagName(
            "title",
        )[0].innerText = newTitle)
    }
    useEffect(() => updateTitle(initialTitle), [initialTitle])
    return (
        <h1 className="text-3xl font-bold pt-2">
            {title}
            <SvgIconButton
                title="Change title"
                className="btn btn-ghost btn-sm px-0 ml-1"
                onClick={() => updateTitle(randomTitle(title))}
                icon="d6"
                color="#888"
            />
        </h1>
    )
}

const RestorePanel = () => {
    const { saves, restore } = useSaves()
    return (
        <div className="grid grid-cols-6 gap-3">
            {saves.map((save, idx) => (
                <button
                    className="btn btn-primary"
                    onClick={() => restore(save.timestamp)}
                    key={idx}
                >
                    {idx}
                </button>
            ))}
        </div>
    )
}
