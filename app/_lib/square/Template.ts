import paths from "./Paths"

export interface Template {
    name: string
    paths: ReadonlyArray<TemplatePath>
}

export interface TemplatePath {
    group: number // corresponds to a color & layer
    svgPath: string // assume a viewbox of -100 to 100 in x & y
}
