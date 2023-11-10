"use client"

import { WithColorPodge } from "../color/state/WithColorPodge"
import { ShowPodge } from "../color/components/ShowPodge"

export const QuiltPage = () => (
    <WithColorPodge defaultCount={3}>
        <div className="flex flex-row h-full">
            <div className="bg-base-200 px-3 h-full min-w-fit">
                <ShowPodge />
            </div>
            <div className="bg-base-100 h-full w-full">
                <ShowQuilt />
            </div>
        </div>
    </WithColorPodge>
)

export const ShowQuilt = () => {
    return <p>Quilt</p>
}
