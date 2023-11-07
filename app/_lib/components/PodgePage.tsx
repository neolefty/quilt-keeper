"use client"

import { WithColorPodge } from "../state/WithColorPodge"
import { ShowPodge } from "./ShowPodge"

export const PodgePage = () => (
    <WithColorPodge defaultCount={3}>
        <ShowPodge />
    </WithColorPodge>
)
