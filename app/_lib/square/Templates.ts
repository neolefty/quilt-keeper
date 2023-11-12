import paths from "./Paths"

import { Template } from "./Square"

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

const heart: Template = {
    name: "heart",
    paths: [
        {
            group: 0,
            svgPath: paths.square,
        },
        {
            group: 1,
            svgPath: paths.heart,
            // correct for viewbox of 0 0 24 24
            transform: `scale(${200 / 24}) translate(100 100)`,
        },
    ],
}

const templates = { diamond, square }

export default templates
