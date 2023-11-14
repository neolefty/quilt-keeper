import { IconPaths } from "../../icons/IconPaths"
import { baseLength as B } from "../../square/Paths"
import { Fragment } from "react"
import { IconG } from "../../icons/IconSvg"

type IconEntry = [keyof typeof IconPaths, () => void]
export const CircleOfButtons = ({
    icons,
}: {
    icons: Record<keyof typeof IconPaths, () => void>
}) => {
    const n = Object.keys(icons).length
    // the radius of the circle of buttons
    const ringRadius = B * 0.5
    const buttonRadius = (B * 0.4 * Math.PI) / n
    const iconScale = (0.8 * buttonRadius) / 12
    return Object.entries(icons).map((entry, idx) => {
        const [icon, onClick] = entry as IconEntry
        const angle = (idx * 2 * Math.PI) / n
        const x = Math.cos(angle) * ringRadius
        const y = Math.sin(angle) * ringRadius
        const circleTransform = `translate(${x} ${y})`
        const iconTransform = `scale(${iconScale}) translate(-12 -12)`
        // Note on layout and hover: Circle needs to not be a sibling of the rect so that
        // hovering the circle will de-hover the rect, to make the effect of clicking unobscured.
        return (
            <Fragment key={icon}>
                <g transform={circleTransform}>
                    <circle
                        r={buttonRadius}
                        fill="#000000"
                        opacity={0}
                        className="cursor-pointer hover:opacity-20 active:opacity-60 transition-opacity duration-200"
                        onClick={onClick}
                    />
                    <g
                        transform={iconTransform}
                        className="pointer-events-none"
                    >
                        <IconG icon={icon} />
                    </g>
                </g>
            </Fragment>
        )
    })
}
