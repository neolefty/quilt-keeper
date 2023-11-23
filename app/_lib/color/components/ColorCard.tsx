import { useCallback } from "react"
import Image from "next/image"
import pinCircle from "../../../../public/pin-circle.svg"
import pinnedCircle from "../../../../public/pinned-circle.svg"
import { DriftColor } from "../DriftColor"
import { useColors } from "../state/ColorsProvider"
import { SvgIconButton } from "./SvgIconButton"

export const ColorCard = ({
    color,
    idx,
}: {
    color: DriftColor
    idx: number
}) => {
    const { colors, setColors } = useColors()
    const handleTogglePinned = useCallback(
        () => setColors(colors.setPinned(idx, !color.isPinned)),
        [color, idx, colors, setColors],
    )
    const randomizeColor = useCallback(() => {
        setColors(
            colors.replaceColor(
                idx,
                colors.lookForDistantColor(colors.length + 2),
                true,
            ),
        )
    }, [colors, idx, setColors])
    return (
        <div
            className="card shadow-xl text-center flex flex-row items-center justify-center pl-2 pr-1"
            key={idx}
            style={{
                backgroundColor: color.hexString,
                color: color.contrast().hexString,
            }}
        >
            <span className="flex-1 text-sm">{color.hexString}</span>
            <SvgIconButton
                title="Randomize colors"
                className="btn btn-ghost px-1"
                onClick={randomizeColor}
                icon="d6"
            />
            <TogglePinnedButton
                checked={color.isPinned}
                onChange={handleTogglePinned}
                title={
                    color.isPinned
                        ? "Unpin this color — allow it to be enhanced"
                        : "Pin this color — protect it from enhancement"
                }
            />
            <SvgIconButton
                title="Delete this color"
                className="btn btn-ghost px-1"
                onClick={() => setColors(colors.removeColor(idx))}
                icon="trash"
            />
        </div>
    )
}

const TogglePinnedButton = ({
    title,
    checked,
    onChange,
}: {
    title?: string
    checked: boolean
    onChange: () => void
}) => {
    return (
        <div className="btn btn-ghost px-1" title={title}>
            <label className="swap">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <div className="swap-off">
                    <Image src={pinCircle} alt="pin" width={28} height={28} />
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
    )
}
