"use client"

import { ColorsProvider } from "../color/state/ColorsProvider"
import { QuiltControls } from "../color/components/QuiltControls"
import { QuiltProvider } from "./state/QuiltProvider"
import { ShowQuilt } from "./components/ShowQuilt"
import { EditSquareProvider } from "./state/EditSquareProvider"
import { HistoryProvider } from "./state/HistoryProvider"

export const QuiltPage = () => {
    return (
        <ColorsProvider>
            <QuiltProvider defaultQuiltSize={[3, 5]}>
                <HistoryProvider>
                    <EditSquareProvider>
                        <div className="flex flex-row h-full">
                            <div className="bg-base-200 px-3 h-full min-w-fit flex flex-col gap-3">
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
