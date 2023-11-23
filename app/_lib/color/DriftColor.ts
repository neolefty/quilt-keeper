import { CieColor } from "./CieColor"
import { ThreeD } from "../FixedLengthArrays"
import { minMax } from "../MathFunctions"

export class DriftColor {
    // allowed limits on lightness & saturation when drifting (hsluv)
    static readonly MIN_BRIGHT = 25
    static readonly MAX_BRIGHT = 80
    static readonly SPAN_BRIGHT = DriftColor.MAX_BRIGHT - DriftColor.MIN_BRIGHT
    static readonly MID_LIGHT =
        (DriftColor.MIN_BRIGHT + DriftColor.MAX_BRIGHT) / 2
    static readonly MIN_SAT = 30
    static readonly MAX_SAT = 100
    static readonly SPAN_SAT = DriftColor.MAX_SAT - DriftColor.MIN_SAT

    static readonly BLACK: DriftColor = new DriftColor(CieColor.BLACK)

    static clamp_bright(b: number): number {
        return DriftColor.clamp(b, DriftColor.MIN_BRIGHT, DriftColor.MAX_BRIGHT)
    }
    static clamp_sat(s: number): number {
        return DriftColor.clamp(s, DriftColor.MIN_SAT, DriftColor.MAX_SAT)
    }

    static random(): DriftColor {
        return DriftColor.constructHSL(
            // bias towards blue (about 250) because it's pretty
            Math.round(Math.random() * 250 + Math.random() * 250) % 360,
            // Math.random() * 50 + 225,
            // Math.random() * 360,
            Math.random() * this.SPAN_SAT + DriftColor.MIN_SAT,
            Math.random() * this.SPAN_BRIGHT + DriftColor.MIN_BRIGHT,
        )
    }

    static clamp(x: number, min: number, max: number): number {
        return Math.max(min, Math.min(x, max))
    }

    static constructHSL(h: number, s: number, l: number) {
        return new DriftColor(new CieColor([h, s, l]), Math.random())
    }

    constructor(
        readonly cie: CieColor,
        /** A locally unique ID that follows this color as it drifts. */
        readonly key: number = Math.random(),
        /** Should this color drift with the others (false) or stay where it is and let the others drift around it (true)? */
        readonly isPinned: boolean = false,
    ) {}

    /** Using the CIE perceptual color space, create a new color with randomly shifted hue, saturation, and lightness but the same key. */
    drift(f: number) {
        return new DriftColor(
            new CieColor([
                this.cie.hsl[0] + Math.random() * f,
                DriftColor.clamp_sat(this.cie.hsl[1] + Math.random() * f),
                DriftColor.clamp_bright(this.cie.hsl[2] + Math.random() * f),
            ]),
            this.key,
            this.isPinned,
        )
    }

    // shift a certain amount (mag) in a given direction (unit), in hsluv space.
    shift(unit: ThreeD, mag: number): DriftColor {
        return new DriftColor(
            new CieColor([
                unit[0] * mag + this.cie.hsl[0],
                DriftColor.clamp_sat(unit[1] * mag + this.cie.hsl[1]),
                DriftColor.clamp_bright(unit[2] * mag + this.cie.hsl[2]),
            ]),
            this.key,
            this.isPinned,
        )
    }

    d2(that: DriftColor) {
        return this.perceptualD2(that)
    }

    // sum of squares distance using HSL
    hslD2(that: DriftColor): number {
        return this.cie.hslDistance2(that.cie)
    }

    setPinned(pinned: boolean): DriftColor {
        if (pinned === this.isPinned) return this
        else return new DriftColor(this.cie, this.key, pinned)
    }

    // sum of squares distance using CIE LCH
    perceptualD2(that: DriftColor): number {
        return this.cie.perceptualDistance2(that.cie)
    }

    // tslint:disable-next-line:member-ordering
    private _contrast: DriftColor | undefined = undefined
    // A color with the opposite hue and maximum saturation
    contrast(): DriftColor {
        if (!this._contrast) {
            const hsl: ThreeD =
                this.saturation > 10 // if it's not too grey, pop up the saturation
                    ? [
                          this.cie.hsl[0] + 180,
                          DriftColor.MAX_SAT,
                          this.cie.hsl[2] > DriftColor.MID_LIGHT
                              ? DriftColor.MIN_BRIGHT + 5 /* allow more color*/
                              : DriftColor.MAX_BRIGHT,
                      ]
                    : [
                          // if it's very close to grey, make it dark or light grey
                          this.cie.hsl[0] + 180,
                          0,
                          this.cie.hsl[2] > DriftColor.MID_LIGHT
                              ? DriftColor.MIN_BRIGHT - 5
                              : DriftColor.MAX_BRIGHT + 5,
                      ]
            this._contrast = new DriftColor(
                new CieColor(hsl),
                1 - this.key,
                this.isPinned,
            )
        }
        return this._contrast
    }

    get hue() {
        return this.cie.hue
    }
    get saturation() {
        return this.cie.saturation
    }
    get lightness() {
        return this.cie.lightness
    }

    get hexString() {
        return this.cie.hexString
    }
    get hslString() {
        return this.cie.hslString
    }
    get lchString() {
        return this.cie.lchString
    }

    // tslint:disable-next-line:member-ordering
    private lightCache = new Map<number, DriftColor>()

    darker = (diff = 20): DriftColor =>
        this.withLightness(this.lightness - diff)

    lighter = (diff = 20): DriftColor =>
        this.withLightness(this.lightness + diff)

    withLightness = (lightness: number): DriftColor => {
        lightness = minMax(lightness, 0, 100)
        if (!this.lightCache.has(lightness))
            this.lightCache.set(
                lightness,
                new DriftColor(
                    this.cie.withLightness(lightness),
                    this.key * (lightness / 100),
                    this.isPinned,
                ),
            )
        return this.lightCache.get(lightness) as DriftColor
    }

    // A color with same hue & sat, but slightly lighter or darker, for texture
    texture(diff = 20): DriftColor {
        // lightness 0-25 -- return brighter (too dark to get darker)
        //   - 25-50 -- darker
        //   - 50-75 -- brighter
        //   - 75-100 -- darker (too bright to get brighter)
        const darker: boolean =
            (this.lightness > diff - 5 &&
                this.lightness < DriftColor.MID_LIGHT) ||
            this.lightness > 95 - diff
        return darker ? this.darker(diff) : this.lighter(diff)
    }

    toString(): string {
        return `${this.hexString} - hsl: ${this.hslString} - lch: ${this.lchString}`
    }

    equals(that: unknown): boolean {
        if (!that) return false
        const thatDrift = that as DriftColor
        const thatHsl = thatDrift.cie?.hsl
        return (
            Array.isArray(thatHsl) &&
            thatHsl.length === 3 &&
            thatHsl[0] === this.cie.hsl[0] &&
            thatHsl[1] === this.cie.hsl[1] &&
            thatHsl[2] === this.cie.hsl[2]
        )
    }
}
