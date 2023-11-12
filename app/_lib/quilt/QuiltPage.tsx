"use client"

import { ColorsProvider } from "../color/state/ColorsProvider"
import { ColorControls } from "../color/components/ColorControls"
import { QuiltProvider, useQuilt } from "./QuiltProvider"
import { ShowQuilt } from "./components/ShowQuilt"

export const QuiltPage = () => {
    return (
        <ColorsProvider>
            <QuiltProvider defaultQuiltSize={[3, 5]}>
                <div className="flex flex-row h-full">
                    <div className="bg-base-200 px-3 h-full min-w-fit flex flex-col gap-3">
                        <ColorControls />
                        <hr />
                        <QuiltControls />
                    </div>
                    <div className="bg-base-100 h-full w-full">
                        <ShowQuilt />
                    </div>
                </div>
            </QuiltProvider>
        </ColorsProvider>
    )
}

export const QuiltControls = () => {
    const { quilt, setQuilt, resetQuilt } = useQuilt()
    return (
        <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-primary" onClick={resetQuilt}>
                Reset Quilt
            </button>
        </div>
    )
}
