import { Tile } from "../../square/Square"
import { useColorPodge } from "../../color/state/ColorsProvider"

export const ShowTile = ({ tile }: { tile: Tile }) => {
    const { colors } = useColorPodge()
    const { groupColorMap, template, rotation } = tile
    return (
        <g>
            {tile.template.paths.map(({ group, svgPath, transform }, idx) => {
                const colorId = groupColorMap[group]
                const color = colors.driftColors.find((c) => c.key === colorId)
                return (
                    <path
                        d={svgPath}
                        fill={color?.hexString}
                        key={idx}
                        transform={transform}
                    />
                )
            })}
        </g>
    )
}
