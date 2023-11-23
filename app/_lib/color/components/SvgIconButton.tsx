import { PropsWithChildren } from "react"
import { IconPaths } from "../../icons/IconPaths"
import { IconSvg } from "../../icons/IconSvg"

export const SvgIconButton = ({
    icon,
    title,
    className,
    onClick,
    disabled,
    color,
}: PropsWithChildren<{
    icon: keyof typeof IconPaths
    title?: string
    className?: string
    onClick: () => void
    disabled?: boolean
    color?: string
}>) => (
    <button
        title={title}
        className={`btn ${className}`}
        onClick={onClick}
        disabled={disabled}
    >
        <IconSvg icon={icon} color={disabled ? "#fff3" : color} />
    </button>
)
