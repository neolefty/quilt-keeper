"use client"

import { ColorsProvider } from "../color/state/ColorsProvider"
import { QuiltControls } from "../color/components/QuiltControls"
import { QuiltProvider } from "./state/QuiltProvider"
import { ShowQuilt } from "./components/ShowQuilt"
import { EditSquareProvider } from "./state/EditSquareProvider"
import { HistoryProvider } from "./state/HistoryProvider"
import { useEffect, useState } from "react"
import { randomTitle } from "../../Titles"
import { SvgIconButton } from "../color/components/SvgIconButton"

export const QuiltPage = ({ initialTitle }: { initialTitle: string }) => {
    const [title, setTitle] = useState(initialTitle)

    return (
        <ColorsProvider>
            <QuiltProvider>
                <HistoryProvider>
                    <EditSquareProvider>
                        <div className="flex flex-row h-full">
                            <div className="bg-base-200 px-3 h-full min-w-fit flex flex-col gap-3">
                                <AppTitle initialTitle={title} />
                                <QuiltControls />
                            </div>
                            <div className="bg-base-100 w-full h-full">
                                <ShowQuilt />
                            </div>
                        </div>
                    </EditSquareProvider>
                </HistoryProvider>
            </QuiltProvider>
        </ColorsProvider>
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
