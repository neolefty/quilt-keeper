import { useCallback } from "react"
import Image from "next/image"
import pinCircle from "../../../../public/pin-circle.svg"
import pinnedCircle from "../../../../public/pinned-circle.svg"
import trash from "../../../../public/trash.svg"
import { DriftColor } from "../DriftColor"
import { useColorPodge } from "../state/ColorsProvider"

export const PodgeColorCard = ({
    color,
    idx,
}: {
    color: DriftColor
    idx: number
}) => {
    const { colors, setColors } = useColorPodge()
    const handleTogglePinned = useCallback(
        () =>
            setColors(
                colors.replaceColor(idx, color.setPinned(!color.isPinned)),
            ),
        [color, idx, colors, setColors],
    )
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
                        checked={color.isPinned}
                        onChange={handleTogglePinned}
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
                onClick={() => setColors(colors.removeColor(idx))}
            >
                <Image src={trash} alt="delete" width={28} height={28} />
            </button>
        </div>
    )
}
