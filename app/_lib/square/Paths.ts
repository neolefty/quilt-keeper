/**
 * The basic length that templates are built on.
 * Their viewbox is -baseLength to baseLength.
 */
export const baseLength = 100

// note: assumes viewbox of 0 0 24 24
const heart =
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"

const B = baseLength
const diamond = `M-${B} 0L0 ${B}L${B} 0L0 -${B}z`

const square = `M-${B} -${B}L${B} -${B}L${B} ${B}L-${B} ${B}z`

const paths = { heart, diamond, square }
export default paths
