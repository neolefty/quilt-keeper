export type OneOrMore<T> = [T, ...T[]]
export type ReadonlyOneOrMore<T> = Readonly<OneOrMore<T>>
export type TwoOrMore<T> = [T, T, ...T[]]

/** A 2D array with a dimension of 1 or more in each direction. */
export type OneByOneOrMore<T> = OneOrMore<OneOrMore<T>>
export type ReadonlyOneByOneOrMore<T> = ReadonlyArray<ReadonlyOneOrMore<T>>

// this simpler tuple definition is more usable than type-fest's FixedLengthArray
export type Pair<T> = [T, T] // FixedLengthArray<number, 2>
export type TwoD = Pair<number>
export type Triple<T> = [T, T, T] // FixedLengthArray<number, 3>
export type ThreeD = Triple<number>
