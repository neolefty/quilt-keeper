import { IconPaths } from "./IconPaths"

export const IconSvg = ({
    icon,
    color = "#fff",
}: {
    icon: keyof typeof IconPaths
    color?: string
}) => {
    const Icon = IconPaths[icon]
    return (
        <svg viewBox="0 0 24 24">
            <Icon color={color} />
        </svg>
    )
}

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
        <g viewBox="0 0 24 24" className={className}>
            <Icon color={color} />
        </g>
    )
}
