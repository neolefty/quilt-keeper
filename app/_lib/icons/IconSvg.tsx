import { IconPaths } from "./IconPaths"
import { SVGProps } from "react"

type IconSvgProps = SVGProps<SVGElement> & {
    icon: keyof typeof IconPaths
    color?: string
}

export const IconSvg = ({
    icon,
    color = "#ddd",
    viewBox = iconViewbox,
    height = 28,
    width = 28,
    ref, // can't be trivially drilled
    ...props
}: IconSvgProps) => {
    const Icon = IconPaths[icon]
    return (
        <svg viewBox={viewBox} height={height} width={width} {...props}>
            <Icon color={color} />
        </svg>
    )
}

export const iconViewbox = "0 0 24 24"

export const IconG = ({
    icon,
    color = "#fff",
    className,
}: {
    icon: keyof typeof IconPaths
    color?: string
    className?: string
}) => {
    const Icon = IconPaths[icon]
    return (
        <g viewBox={iconViewbox} className={className}>
            <Icon color={color} />
        </g>
    )
}
