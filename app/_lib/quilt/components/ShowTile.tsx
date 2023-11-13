import { TemplatePath, Tile } from "../../square/Square"
import { useColorPodge } from "../../color/state/ColorsProvider"

const ShowPath = ({ tile, path }: { tile: Tile; path: TemplatePath }) => {
    const { colors } = useColorPodge()
    const { group, svgPath, transform } = path
    const { groupColorMap, template, rotation } = tile
    const colorId = groupColorMap[group]
    const color = colors.driftColors.find((c) => c.key === colorId)
    return <path d={svgPath} fill={color?.hexString} transform={transform} />
}

export const ShowTile = ({ tile }: { tile: Tile }) => {
    const { rotation, mirror, template } = tile
    return (
        // viewbox is supplied by parent; it's always -baseLength to +baseLength in x and y
        <g
            transform={[
                rotation === undefined ? undefined : `rotate(${rotation})`,
                mirror ? "scale(-1, 1)" : undefined,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {template.paths.map((path, idx) => (
                <ShowPath key={idx} tile={tile} path={path} />
            ))}
        </g>
    )
}
