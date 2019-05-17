import * as helpers from './helpers'

export interface MaybeShape<T> {
  /**
   Apply some function to value in container. `map` for Just
   will call the function with value, for `Nothing` return Nothing.
   If `map` will return `null` or `undefined` then return `Nothing`.

   ```ts
   import { Maybe } from 'monad-maniac'

   const zeroDivider = 0
   const tenDivide = (n: number): number => n === 0 ? null : 10 / n
   const foo = Maybe.of(zeroDivider).map(tenDivide) // Noting

   const nonZeroDivider = 2
   const bar = Maybe.of(nonZeroDivider).map(tenDivide) // Just(5)
   ```
  */
  map<U>(f: (value: T) => U): MaybeShape<U>

  chain<U>(f: (value: T) => U): U | undefined

  /** Return true of `Nothing` */
  isNothing(): boolean

  /** Return true if `Just` */
  isJust(): boolean

  /**
   * Unwrap value from monad and return value from `Just`
   * or `defaultValue` if it was Nothing.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const brokenDataMaybe = Maybe.of(null)
   * const normalDataMaybe = Maybe.of(10)
   *
   * const brokenData = brokenDataMaybe.unwrapOr('This data was broken') // This data was broken')
   * const normalData = Maybe.of(10).unwrapOr('This data was broken') // 10
   * ```
   */
  getOrElse<U>(defaultValue: U): T | U

  filter(f: (value: T) => boolean): MaybeShape<T>

  toString(): string
}

/**
 * Unwrap Maybe with default value.
 * Method like [`MaybeShape.getOrElse`](../interfaces/_maybe_.maybeshape.html#getorelse)
 * but to get maybe and call method `getOrElse` with a function.
 *
 * ```ts
 * ```
 * */
export function getOrElse<T, U>(defaultValue: U, maybe: MaybeShape<T>): T | U
/**
 * Just curried `getOrElse`.
 *
 * *(a -> b) -> Maybe(a) -> Maybe(b)*
 */
export function getOrElse<T, U>(defaultValue: U): (maybe: MaybeShape<T>) => T | U
export function getOrElse<T, U>(defaultValue: U, maybe?: MaybeShape<T>): (T | U) | ((maybe: MaybeShape<T>) => T | U) {
  const op = (m: MaybeShape<T>) => m.getOrElse(defaultValue)
  return helpers.curry1(op, maybe)
}

/**
  Create a `Maybe` from any value.
  To specify that the result should be interpreted as a specific type, you may
  invoke `Maybe.of` with an explicit type parameter:

  ```ts
  import { Maybe } from 'monad-maniac'

  const foo = Maybe.of<string>(null) // foo will Nothing
  const bar = Maybe.of<string>('hello') // bar will Just('hello')
  ```
  @typeparam T The type of the item contained in the `Maybe`.
  @param value The value to wrap in a `Maybe`. If it is `undefined` or `null`,
               the result will be `Nothing`; otherwise it will be Just with value with your type.
 */
export function of<T>(value: T | null | undefined): MaybeShape<T> {
  if (value === undefined || value === null) {
    return new Nothing()
  } else {
    return new Just(value)
  }
}

/**
 * Method like [`MaybeShape.map`](../interfaces/_maybe_.maybeshape.html#map)
 * but to get maybe and call method `map` with a function.
 *
 * ```ts
 * import { Maybe } from 'monad-maniac'
 *
 * const foo = Maybe.of(12)
 * const mappedFoo = Maybe.map(foo, (x) => x * x) // Just(144)
 * ```
 * */
export function map<T, U>(f: (value: T) => U, maybe: MaybeShape<T>): T
/**
 * Just curried `map`.
 *
 * _(a -> b) -> Maybe(a) -> Maybe(b)_
 */
export function map<T, U>(f: (value: T) => U): (maybe: MaybeShape<T>) => T
export function map<T, U>(f: (value: T) => U, maybe?: MaybeShape<T>): MaybeShape<U> | ((maybe: MaybeShape<T>) => MaybeShape<U>) {
  const op = (m: MaybeShape<T>) => m.map(f)
  return helpers.curry1(op, maybe)
}

export class Just<T> implements MaybeShape<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  /** Method implements from [`MaybeShape.map`](../interfaces/_maybe_.maybeshape.html#map) */
  map<U>(f: (value: T) => U): MaybeShape<U> {
    return of(f(this.value))
  }

  /** Returns `true`. */
  isJust(): boolean {
    return true
  }

  /** Returns `false`. */
  isNothing(): boolean {
    return false
  }

  /**  Method implements from [`MaybeShape.getOrElse`](../interfaces/_maybe_.maybeshape.html#getorelse) */
  getOrElse<U>(_defaultValue: U): T | U {
    return this.value
  }

  chain<U>(f: (value: T) => U): U {
    return f(this.value)
  }

  filter(f: (value: T) => boolean): MaybeShape<T> {
    return f(this.value) === false ? new Nothing() : this
  }

  toString(): string {
    return `Just(${String(this.value)})`
  }
}

export class Nothing<T> implements MaybeShape<T> {
  /** Method implements from [`MaybeShape.map`](../interfaces/_maybe_.maybeshape.html#map) */
  map<U>(_f: (value: T) => U): MaybeShape<U> {
    return new Nothing()
  }

  /** Returns `false`. */
  isJust(): boolean {
    return false
  }

  /** Returns `true`. */
  isNothing(): boolean {
    return true
  }

  /**  Method implements from [`MaybeShape.getOrElse`](../interfaces/_maybe_.maybeshape.html#getorelse) */
  getOrElse<U>(defaultValue: U): T | U {
    return defaultValue
  }

  chain<U>(_f: (value: T) => U): undefined {
    return undefined
  }

  filter(_f: (value: T) => boolean): MaybeShape<T> {
    return this
  }

  toString(): string {
    return 'Nothing()'
  }
}
