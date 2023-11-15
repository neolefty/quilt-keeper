import { IconPaths } from "../../icons/IconPaths"
import { baseLength as B } from "../../square/Paths"
import { Fragment } from "react"
import { IconG } from "../../icons/IconSvg"
import clsx from "clsx"

type IconEntry = [keyof typeof IconPaths, (() => void) | undefined]
export const CircleOfButtons = ({
    /**
     *  A map of icon names to click handlers.
     *  Icons with undefined click handlers will be rendered as disabled buttons.
     */
    icons,
}: {
    icons: Partial<Record<keyof typeof IconPaths, (() => void) | undefined>>
}) => {
    const n = Object.keys(icons).length
    // the radius of the circle of buttons
    const ringRadius = B * 0.55
    const buttonRadius = (ringRadius * Math.PI) / n
    const iconScale = (0.75 * buttonRadius) / 12
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
                        fill={onClick ? "#000000" : undefined}
                        opacity={0}
                        className={clsx(
                            "cursor-pointer transition-opacity duration-200",
                            !!onClick && "active:opacity-60 hover:opacity-20",
                        )}
                        onClick={onClick}
                    />
                    <g
                        transform={iconTransform}
                        className="pointer-events-none"
                    >
                        <IconG
                            icon={icon}
                            color={onClick ? "#fff" : "#ffffff77"}
                        />
                    </g>
                </g>
            </Fragment>
        )
    })
}
