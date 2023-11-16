/**
 * The basic length that templates are built on.
 * Their viewbox is -baseLength to baseLength.
 */
export const baseLength = 100

// note: assumes viewbox of 0 0 24 24
const heart =
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"

const B = baseLength

// 45 degree diamond
const diamond = `M-${B} 0L0 ${B}L${B} 0L0 -${B}z`

// full background square
const square = `M-${B} -${B}L${B} -${B}L${B} ${B}L-${B} ${B}z`

const sin225 = Math.sin((22.5 * Math.PI) / 180)
const daggerIntercept = B * 2 * sin225 - B
// diagonal isosceles triangle
const dagger = `M-${B} -${B}L${daggerIntercept} ${B}L${B} ${daggerIntercept}z`

// diagonal half-square
const diagonal = `M${B} ${B}L-${B} -${B}L-${B} ${B}z`

// quarter-circle
const wedge = `M${B} ${B}A200 200 0 0 1 -${B} -${B}L${B} -${B}z`

const sled = `M0 ${B}L${B} -${B}L${B} ${B}z`

const paths = { dagger, diagonal, diamond, heart, sled, square, wedge }
export default paths
