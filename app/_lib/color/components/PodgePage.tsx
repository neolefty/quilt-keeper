"use client"

import { ShowPodge } from "./ShowPodge"
import { WithColorPodge } from "../state/WithColorPodge"

export const PodgePage = () => (
    <WithColorPodge defaultCount={3}>
        <ShowPodge />
    </WithColorPodge>
)
