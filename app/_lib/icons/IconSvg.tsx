import { IconPaths } from "./IconPaths"

export const IconSvg = ({ icon }: { icon: keyof typeof IconPaths }) => {
    const Icon = IconPaths[icon]
    return (
        <svg viewBox="0 0 24 24" fill="none">
            <Icon />
        </svg>
    )
}

export const IconG = ({
    icon,
    stroke = "#ffffff",
    fill = "none",
    className,
}: {
    icon: keyof typeof IconPaths
    stroke?: string
    fill?: string
    className?: string
}) => {
    const Icon = IconPaths[icon]
    return (
        <g
            viewBox="0 0 24 24"
            fill={fill}
            stroke={stroke}
            className={className}
        >
            <Icon />
        </g>
    )
}
