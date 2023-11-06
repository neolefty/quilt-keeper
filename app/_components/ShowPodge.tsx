"use client"

import { ColorPodge } from "../_lib/color/ColorPodge"
import { useEffect, useState } from "react"

export const ShowPodge = () => {
    const [podge, setPodge] = useState(new ColorPodge())
    useEffect(() => {
        // start with three colors
        if (podge.length === 0)
            setPodge(podge.addRandomColor().addRandomColor().addRandomColor())
    }, [podge])
    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setPodge(podge.disperse(5))}
                >
                    Step
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
