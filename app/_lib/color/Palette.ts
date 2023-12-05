import { DriftColor, DriftColorJsSchema } from "./DriftColor"
import { ThreeD, TwoD } from "../FixedLengthArrays"
import { Static, Type } from "@sinclair/typebox"

interface DistCache {
    [key: number]: TwoD
}

export const PaletteJsSchema = Type.Object({
    driftColors: Type.Array(DriftColorJsSchema),
    neverSettle: Type.Boolean(),
    settled: Type.Boolean(),
    dispersionHistory: Type.Array(Type.Number()),
})
export type PaletteJS = Static<typeof PaletteJsSchema>

// export interface PaletteJS {
//     driftColors: ReadonlyArray<DriftColorJS>
//     neverSettle: boolean
//     settled: boolean
//     dispersionHistory: ReadonlyArray<number>
// }

// A collection of colors in CIE space — a perceptual color space
// — that can disperse themselves to be roughly equidistant.
export class Palette {
    static readonly HSV_DELTAS: ReadonlyArray<ThreeD> = [
        // index 1 is larger because LCh Chroma is scaled down saturation
        // and won't shift at all if we use 1 -- shifts happen in HSV space.
        [-1, 0, 0],
        [0, -3, 0],
        [0, 0, -1],
        [1, 0, 0],
        [0, 3, 0],
        [0, 0, 1],
    ]

    // The poor programmer's version, but still
    static readonly ANNEAL = [16, 13, 10, 7, 7, 7, 5, 5, 5, 5, 3, 3, 2, 1, 1, 1]

    static MAX_DISPERSION_HISTORY = 320
    static SETTLED_THRESHOLD = 150

    static construct = (
        numColors: number,
        anneal = true,
        distanceTrials: number = 1,
    ) => {
        let result = new Palette()
        while (result.driftColors.length < numColors)
            result = result.addRandomColor(distanceTrials)[0]
        if (anneal) Palette.ANNEAL.forEach((x) => (result = result.disperse(x)))
        return result
    }

    static fromJs = (js: PaletteJS) => {
        return new Palette(
            js.driftColors.map((dc) => DriftColor.fromJS(dc)),
            js.neverSettle,
            js.settled,
            js.dispersionHistory,
        )
    }

    readonly byKey: Map<number, DriftColor>

    constructor(
        readonly driftColors: ReadonlyArray<DriftColor> = [],
        readonly neverSettle: boolean = true,
        // if these aren't set, tracking settling is reset
        readonly settled: boolean = false, // has dispersion settled down?
        // history of the last few closestTwo score
        readonly dispersionHistory: ReadonlyArray<number> = [],
    ) {
        this.byKey = new Map(driftColors.map((dc) => [dc.key, dc]))
    }

    toJs(): PaletteJS {
        return {
            driftColors: this.driftColors.map((dc) => dc.toJs()),
            neverSettle: this.neverSettle,
            settled: this.settled,
            dispersionHistory: [...this.dispersionHistory],
        }
    }

    get length() {
        return this.driftColors.length
    }

    lookForDistantColor(distanceTrials = 1): DriftColor {
        if (distanceTrials < 1)
            throw new Error(`distanceTrials < 1 (${distanceTrials}})}`)
        const actualTrials = this.length === 0 ? 1 : distanceTrials
        let distantColor = DriftColor.BLACK
        let maxMinDist = -Infinity
        for (let i = 0; i < actualTrials; i++) {
            const color = DriftColor.random()
            const dist = this.minDist(color, undefined, true)
            if (dist > maxMinDist) {
                distantColor = color
                maxMinDist = dist
            }
        }
        if (distantColor === DriftColor.BLACK)
            throw new Error("failed to find distant color")
        return distantColor
    }

    /**
     * Add a random color to this palette.
     * @param distanceTrials add the Nth random color that is furthest from existing colors.
     */
    addRandomColor(distanceTrials = 1): [Palette, DriftColor] {
        const newColor = this.lookForDistantColor(distanceTrials)
        return [
            new Palette(
                [...this.driftColors, newColor],
                this.neverSettle,
                // reset settlement tracking because a new color is in the mix
            ),
            newColor,
        ]
    }

    removeColor(idx: number): Palette {
        // reset settlement tracking because a color has been removed
        const newColors = this.driftColors.toSpliced(idx, 1)
        return new Palette(newColors, this.neverSettle)
    }

    replaceColor(
        idx: number,
        newColor: DriftColor,
        preserveAttributes?: boolean,
    ): Palette {
        const newColors = [...this.driftColors]
        const oldColor = this.driftColors[idx]
        newColors[idx] = preserveAttributes
            ? new DriftColor(newColor.cie, oldColor.key, oldColor.isPinned)
            : newColor
        return new Palette(newColors, this.neverSettle)
    }

    setPinned(idx: number, pinned: boolean): Palette {
        const color = this.driftColors[idx]
        if (color.isPinned === pinned) return this
        else return this.replaceColor(idx, color.setPinned(pinned))
    }

    sort(comparator: (a: DriftColor, b: DriftColor) => number): Palette {
        return new Palette(this.driftColors.toSorted(comparator))
    }

    // random walk
    drift(f: number): Palette {
        // reset settlement tracking because colors have been shuffled
        return new Palette(
            this.driftColors.map((color: DriftColor) => color.drift(f)),
            this.neverSettle,
        )
    }

    // spread colors away from each other
    disperse(stepSize: number): Palette {
        if (this.settled) return this

        // if this closestTwo score appears twice in our history, we're settled.
        const c = this.closestTwo()
        const newSettled =
            !this.neverSettle &&
            this.dispersionHistory.filter((x) => x === c).length >=
                Palette.SETTLED_THRESHOLD
        if (newSettled)
            return new Palette(
                this.driftColors,
                this.neverSettle,
                newSettled,
                this.dispersionHistory,
            )

        // not settled, so disperse again
        const newDispersionHistory = [
            ...this.dispersionHistory,
            this.closestTwo(),
        ]
        if (newDispersionHistory.length > Palette.MAX_DISPERSION_HISTORY)
            newDispersionHistory.splice(0, 1)
        const newColors = this.driftColors.map((color) =>
            this.disperseOne(color, stepSize),
        )
        return new Palette(
            newColors,
            this.neverSettle,
            newSettled,
            newDispersionHistory,
        )
        // console.log(`${Math.round(before)} -- drift ${f} -- ${result.toString()}`);
        // console.log(`${this.toString()} -- drift ${f} -- ${result.toString()}`);
    }

    // The perceptual distance between the closest two colors
    closestTwo(): number {
        return this.closestFurthestTwo()[0]!
    }

    // The perceptual distance between the furthest two colors
    furthestTwo(): number {
        return this.closestFurthestTwo()[1]
    }

    /* tslint:disable:member-ordering */
    private readonly closestFurtherTwoCache: TwoD = [Infinity, -Infinity]
    /* tslint:enable */
    closestFurthestTwo(): TwoD {
        if (this.closestFurtherTwoCache[0] === Infinity)
            if (this.driftColors.length <= 1)
                Palette.mutateMinMax2(this.closestFurtherTwoCache, [0, 0])
            else
                this.driftColors.forEach((color: DriftColor) =>
                    Palette.mutateMinMax2(
                        this.closestFurtherTwoCache,
                        this.minMaxDist(color),
                    ),
                )
        return this.closestFurtherTwoCache
    }

    /* tslint:disable:member-ordering */
    static mutateMinMax2(a: TwoD, b: TwoD) {
        a[0] = Math.min(a[0], b[0])
        a[1] = Math.max(a[1], b[1])
    }
    /* tslint:enable */

    /**
     * Try moving color a distance f in each of 6 directions and return the one
     * with the largest minimum distance from all other colors.
     * No effect if color.isPinned.
     */
    disperseOne(color: DriftColor, f: number): DriftColor {
        if (color.isPinned) return color

        let result = color
        let maxMinDist = this.minDist(color)
        Palette.HSV_DELTAS.forEach((delta) => {
            const candidate = color.shift(delta, f)
            const dist = this.minDist(candidate, color, true)
            // console.log(`${color} -- consider ${c} -- ${d}`);
            if (dist > maxMinDist) {
                result = candidate
                maxMinDist = dist
            }
        })
        return result
    }

    /** Distance from color to the closest member of this palette. */
    minDist(color: DriftColor, ignore?: DriftColor, ignoreCache = false) {
        return this.minMaxDist(color, ignore, ignoreCache)[0]!
    }

    maxDist(color: DriftColor, ignore?: DriftColor, ignoreCache = false) {
        return this.minMaxDist(color, ignore, ignoreCache)[1]
    }

    /* tslint:disable:member-ordering */
    private readonly minMaxDistCache: DistCache = {}
    /* tslint:enable */
    // what are the distances to the nearest and farthest other color in this palette?
    // if ignore is supplied, skip it in the list of colors
    minMaxDist(color: DriftColor, ignore?: DriftColor, ignoreCache = false) {
        let result = this.minMaxDistCache[color.key]
        if (ignoreCache || !result) {
            result = [Infinity, -Infinity]
            this.driftColors.forEach((otherColor: DriftColor) => {
                if (otherColor !== color && otherColor !== ignore) {
                    // const pd = dc.hslD2(color);
                    const pd = otherColor.perceptualD2(color)
                    Palette.mutateMinMax2(result!, [pd, pd])
                }
            })
            if (!ignoreCache) this.minMaxDistCache[color.key] = result
        }
        return result
    }

    toString(): string {
        let result = `${Math.round(this.closestTwo())}`
        this.driftColors.forEach(
            (dc) => (result = result + `; ${dc.hslString}`),
        )
        return result
    }

    pickRandom(): DriftColor {
        if (this.length === 0) throw new Error("empty palette")
        return this.driftColors[
            Math.floor(Math.random() * this.driftColors.length)
        ]
    }
}
