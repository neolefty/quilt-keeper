import paths, { baseLength } from "./Paths"

import { Template } from "./Square"

const dagger: Template = {
    name: "dagger",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.dagger },
        { group: 2, svgPath: paths.corner },
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

const sliver: Template = {
    name: "sliver",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.dagger },
        { group: 2, svgPath: paths.sliver },
        { group: 3, svgPath: paths.corner },
    ],
}

const doubleSliver: Template = {
    name: "sliver",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.dagger },
        { group: 2, svgPath: paths.sliver },
        { group: 3, svgPath: paths.splitSliver },
        { group: 4, svgPath: paths.corner },
    ],
}

const splitSliver: Template = {
    name: "sliver",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.dagger },
        { group: 3, svgPath: paths.splitSliver },
        { group: 4, svgPath: paths.corner },
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

const sled: Template = {
    name: "sled",
    paths: [
        { group: 0, svgPath: paths.square },
        { group: 1, svgPath: paths.sled },
    ],
}

const templates = {
    dagger,
    diagonal,
    diamond,
    doubleSliver,
    heart,
    /*sled, sliver, */
    splitSliver,
    square,
    wedge,
}

export default templates
