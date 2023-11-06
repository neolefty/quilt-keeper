"use client"

import { ColorPodge } from "../_lib/color/ColorPodge"
import { useCallback, useEffect, useState } from "react"

export const ShowPodge = () => {
    const [podge, setPodge] = useState(new ColorPodge())
    const updatePodge = useCallback((newPodge: ColorPodge) => {
        const sortedPodge = newPodge.sort((a, b) => a.hue - b.hue)
        setPodge(sortedPodge)
    }, [])
    useEffect(() => {
        // start with three colors
        if (podge.length === 0)
            updatePodge(
                podge.addRandomColor().addRandomColor().addRandomColor(),
            )
    }, [podge, updatePodge])
    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-4 gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => updatePodge(podge.disperse(2))}
                >
                    Step 2
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => updatePodge(podge.disperse(5))}
                >
                    Step 5
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => updatePodge(podge.disperse(12))}
                >
                    Step 12
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPodge(podge.addRandomColor())}
                >
                    Add
                </button>
            </div>
            <hr />
            {podge.driftColors.map((color, i) => (
                <div
                    className="card shadow-xl p-3 text-center"
                    key={i}
                    style={{
                        backgroundColor: color.hexString,
                        color: color.contrast().hexString,
                    }}
                    onClick={() => setPodge(podge.removeColor(i))}
                >
                    {color.hexString}
                </div>
            ))}
        </div>
    )
}
