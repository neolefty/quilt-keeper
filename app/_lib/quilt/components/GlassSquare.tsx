import { baseLength as B } from "../../square/Paths"

export const GlassSquare = ({
    opacity = 0,
    className = "hover:opacity-100 transition-opacity duration-200",
    fill = "#00000033",
    onClick,
}: {
    className?: string
    fill?: string
    opacity?: number
    onClick?: () => void
}) => (
    <rect
        opacity={opacity}
        className={className}
        fill={fill}
        onClick={onClick}
        x={-B}
        y={-B}
        width={B * 2}
        height={B * 2}
    />
)
