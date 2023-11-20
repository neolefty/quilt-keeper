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
// corner of a dagger along the edge of a square (where x or y is maximum)
const daggerIntercept = B * 2 * sin225 - B

// diagonal isosceles triangle
const dagger = `M-${B} -${B}L${daggerIntercept} ${B}L${B} ${daggerIntercept}z`

// corner complement to dagger
const corner = `M${B} ${B}L${daggerIntercept} ${B}L${B} ${daggerIntercept}z`

// midpoint of a sliver, along the square's midline (where x or y is 0)
const sliverIntercept = B * sin225 - B
// the diagonal farthest point of a sliver (both x and y)
const sliverPoint = (daggerIntercept + B) / 2

// diamond-shaped half of a sliver — one-eighth of a star
const sliver = `M-${B} -${B}L${sliverIntercept} 0L${sliverPoint} ${sliverPoint}L0 ${sliverIntercept}z`

// two halves of a sliver, each along the edge of a square — together with a sliver makes a quarter of an eight-pointed star
const splitSliver = `M-${B} -${B}L${sliverIntercept} 0L-${B} ${B}z M-${B} -${B}L0 ${sliverIntercept}L${B} -${B}z`

// diagonal half-square
const diagonal = `M${B} ${B}L-${B} -${B}L-${B} ${B}z`

// quarter-circle
const wedge = `M${B} ${B}A200 200 0 0 1 -${B} -${B}L${B} -${B}z`

const sled = `M0 ${B}L${B} -${B}L${B} ${B}z`

const paths = {
    corner,
    dagger,
    diagonal,
    diamond,
    heart,
    sled,
    sliver,
    splitSliver,
    square,
    wedge,
}
export default paths
