"use client"

import {
    PaletteProvider,
    ProvideStaticPalette,
} from "../color/state/PaletteProvider"
import { QuiltControls } from "../color/components/QuiltControls"
import { QuiltProvider } from "./state/QuiltProvider"
import { ShowQuilt } from "./components/ShowQuilt"
import { EditSquareProvider } from "./state/EditSquareProvider"
import { HistoryProvider } from "../history/HistoryProvider"
import { useEffect, useMemo, useRef, useState } from "react"
import { randomTitle } from "../../Titles"
import { SvgIconButton } from "../color/components/SvgIconButton"
import { SaveProvider, SaveRecord, useSaves } from "../history/SaveProvider"
import { SidePanelH2 } from "../SidePanelH2"
import { ShowSquare } from "./components/ShowSquare"
import { Palette } from "../color/Palette"
import { quiltDimensions } from "./quiltFunctions"
import { baseLength } from "../square/Paths"
import clsx from "clsx"

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

const saveColumns = 4

const RestorePanel = () => {
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

const RestoreQuiltButton = ({
    save: { quilt, palette, timestamp },
    maxColumns,
}: {
    save: SaveRecord
    maxColumns: number
}) => {
    const { restore } = useSaves()
    const paletteReal = useMemo(() => Palette.fromJs(palette), [palette])
    const [width, height] = quiltDimensions(quilt)
    const columns = Math.min(Math.round(width / 4), maxColumns)
    const rows = Math.round((columns * height) / width)
    return (
        <button
            className={clsx(
                "btn btn-primary m-0 p-0",
                `col-span-${columns}`,
                `row-span-${rows}`,
            )}
            onClick={() => restore(timestamp)}
        >
            <ProvideStaticPalette palette={paletteReal}>
                <svg
                    viewBox={`0 0 ${baseLength * width * 2} ${
                        baseLength * height * 2
                    }`}
                >
                    <ShowSquare square={quilt} />
                </svg>
            </ProvideStaticPalette>
        </button>
    )
}
