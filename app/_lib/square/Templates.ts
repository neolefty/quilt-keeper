import paths, { baseLength } from "./Paths"

import { Template } from "./Square"

const dagger: Template = {
    name: "dagger",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.dagger },
    ],
}

const diagonal: Template = {
    name: "diagonal",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.diagonal },
    ],
}

const diamond: Template = {
    name: "diamond",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.diamond },
    ],
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
            transform: `scale(${(baseLength * 2) / 24}) translate(-12 -12)`,
        },
    ],
}

const square: Template = {
    name: "square",
    paths: [{ group: 0, svgPath: paths.square }],
}

const wedge: Template = {
    name: "wedge",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.wedge },
    ],
}

const templates = { dagger, diagonal, diamond, heart, square, wedge }

export default templates
