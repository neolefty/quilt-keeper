import paths from "./Paths"
import { Template } from "./Template"

const diamond: Template = {
    name: "diamond",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.diamond },
    ],
}

const square: Template = {
    name: "square",
    paths: [{ group: 0, svgPath: paths.square }],
}

const templates = { diamond, square }

export default templates
