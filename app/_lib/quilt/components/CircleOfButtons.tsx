import { IconPaths } from "../../icons/IconPaths"
import { baseLength as B } from "../../square/Paths"
import { IconG } from "../../icons/IconSvg"
import clsx from "clsx"

type IconEntry = [keyof typeof IconPaths, (() => void) | undefined]

export const CircleButton = ({
    r,
    onClick,
    icon,
}: {
    r: number
    onClick: (() => void) | undefined
    icon: keyof typeof IconPaths
}) => {
    const iconScale = (0.75 * r) / 12
    const iconTransform = `scale(${iconScale}) translate(-12 -12)`
    return (
        <>
            <circle
                r={r}
                fill={onClick ? "#000000" : undefined}
                opacity={0}
                className={clsx(
                    "transition-opacity duration-200",
                    !!onClick &&
                        "active:opacity-60 hover:opacity-20 cursor-pointer",
                )}
                onClick={onClick}
            />
            <g transform={iconTransform} className="pointer-events-none">
                <IconG icon={icon} color={onClick ? "#fff" : "#ffffff77"} />
            </g>
        </>
    )
}

/** A circle of buttons that just touch each other and fill the available space. */
export const CircleOfButtons = ({
    /**
     *  A map of icon names to click handlers.
     *  Icons with undefined click handlers will be rendered as disabled buttons.
     */
    icons,
    outerRadius,
}: {
    icons: Partial<Record<keyof typeof IconPaths, (() => void) | undefined>>
    outerRadius: number
}) => {
    const n = Object.keys(icons).length
    // The radius of the circle of buttons — consider the right triangle formed by the center of the circle,
    // the center of a button, and the tangent point of the button with its neighbor.
    // * ringRadius is the hypotenuse,
    // * the triangle's angle at the center of the circle is π/n, and
    // * buttonRadius is that angle's opposite side.
    // Therefore, sin(π/n) = buttonRadius / ringRadius.
    // Also, ringRadius + buttonRadius = outerRadius.
    // Solving those two equations for ringRadius gives this equation:
    const ringRadius = outerRadius / (1 + Math.sin(Math.PI / n))
    // And then work backwards to get buttonRadius:
    const buttonRadius = outerRadius - ringRadius
    console.log({ n, ringRadius, buttonRadius })
    return Object.entries(icons).map((entry, idx) => {
        const [icon, onClick] = entry as IconEntry
        const angle = (idx * 2 * Math.PI) / n
        const x = Math.cos(angle) * ringRadius
        const y = Math.sin(angle) * ringRadius
        // Note on layout and hover: Circle needs to not be a sibling of the rect so that
        // hovering the circle will de-hover the rect, to make the effect of clicking unobscured.
        return (
            <g transform={`translate(${x} ${y})`} key={icon}>
                <CircleButton r={buttonRadius} onClick={onClick} icon={icon} />
            </g>
        )
    })
}
