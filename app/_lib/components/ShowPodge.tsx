import Image from "next/image"
import { useColorPodge } from "../state/WithColorPodge"
import { PodgeControls } from "./PodgeControls"
import { DriftColor } from "../color/DriftColor"
import trash from "../../../public/trash.svg"
import pinCircle from "../../../public/pin-circle.svg"
import pinnedCircle from "../../../public/pinned-circle.svg"
import { useState } from "react"

export const ShowPodge = () => {
    const { podge, setPodge, sortPodge } = useColorPodge()
    return (
        <div className="grid gap-3">
            <PodgeControls />
            <hr />
            {podge.driftColors.map((color, idx) => (
                <PodgeColorCard color={color} idx={idx} key={idx} />
            ))}
        </div>
    )
}

const PodgeColorCard = ({ color, idx }: { color: DriftColor; idx: number }) => {
    const { podge, setPodge } = useColorPodge()
    const [pinned, setPinned] = useState(false)
    return (
        <div
            className="card shadow-xl text-center flex flex-row items-center justify-center px-1"
            key={idx}
            style={{
                backgroundColor: color.hexString,
                color: color.contrast().hexString,
            }}
        >
            <span className="flex-1 pr-3">{color.hexString}</span>
            <div className="btn btn-ghost px-1">
                <label className="swap">
                    <input
                        type="checkbox"
                        checked={pinned}
                        onChange={() => setPinned(!pinned)}
                    />
                    <div className="swap-off">
                        <Image
                            src={pinCircle}
                            alt="pin"
                            width={28}
                            height={28}
                        />
                    </div>
                    <div className="swap-on">
                        <Image
                            src={pinnedCircle}
                            alt="pin"
                            width={28}
                            height={28}
                        />
                    </div>
                </label>
            </div>
            <button
                className="btn btn-ghost px-1"
                onClick={() => setPodge(podge.removeColor(idx))}
            >
                <Image src={trash} alt="delete" width={28} height={28} />
            </button>
        </div>
    )
}