import * as helpers from './helpers'

type Nullable<T> = T | null | undefined

type ApplicativeResult<T, U extends ((value: T) => any)> = MaybeShape<NonNullable<ReturnType<U>>>

type JoinMaybe<T> = T extends MaybeShape<any> ? T : MaybeShape<T>

/**
 * Type of `caseOf` method.
 *
 * `Just` must be function what takes value from `Maybe` if the `Maybe` is `Just(some)` and return some value.
 *
 *  `Nothing` must be function what return some value if the `Maybe` is `Nothing()`.
 */
export type CaseOf<T, U> = {
  Just: (value: T) => U,
  Nothing: () => U,
}

export interface MaybeShape<T> {
  /**
   * Apply some function to value in container. `map` for Just
   * will call the function with value, for `Nothing` return Nothing.
   * If `map` will return `null` or `undefined` then return `Nothing`.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const zeroDivider = 0
   * const tenDivide = (n: number): number => n === 0 ? null : 10 / n
   * const foo = Maybe.of(zeroDivider).map(tenDivide) // Noting
   *
   * const nonZeroDivider = 2
   * const bar = Maybe.of(nonZeroDivider).map(tenDivide) // Just(5)
   * ```
  */
  map<U>(f: (value: NonNullable<T>) => Nullable<U>): MaybeShape<NonNullable<U>>

  /**
   * Working like [`MaybeShape.map`](#map) but returns not `Maybe`, but the function result.
   * If `chain` will call on `Nothing` then return `undefined`.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const result = Maybe
   *  .of(100)
   *  .map((x) => x / 2) // 50
   *  .map((x) => x + 10) // 60
   *  .chain((x) => x / 3) // 20
   * console.log(result) // 20
   *
   * const resultBad = Maybe
   *  .of(100)
   *  .map((x) => x / 2) // 50
   *  .filter((x) => x > 1000) // Nothing() - next function will be called never
   *  .map((x) => x + 10) // 60
   *  .chain((x) => x / 3) // 20 - actually the function will not be called
   * console.log(result) // undefined
   * ```
   */
  chain<U>(f: (value: T) => U): U | undefined

  /** Return true if `Nothing` */
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
   * */
  getOrElse<U>(defaultValue: U): T | U

  /**
   * Filtering value in `Maybe`. Takes predicate function and
   * return new `Maybe`. If the function return `false`, then
   * maybe will `Noting` otherwise `Just`.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const result = Maybe
   *  .of(10)
   *  .map((x) => x * x)
   *  .filter((x) => x > 50) // result will Just(100)
   *  .filter((x) => x < 90) // result will Nothing()
   *
   * console.log(result.toString()) // Nothing()
   * ```
   */
  filter(f: (value: T) => boolean): MaybeShape<T>

  /**
   * Returns `Nothing()` if `Maybe` is `Nothing`, else
   * `Just(value converted to string)`.
   */
  toString(): string

  /**
   *
   * @param maybe Getting `Maybe(fn)` and apply function from `Maybe` to
   * value from current `Maybe`
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   * const just = Maybe.of(5)
   * const maybeAdd = Maybe.of((x) => x + 1)
   * const maybeAddNull = Maybe.of(null)
   *
   * const resultAdd = just.apply(maybeAdd).toString() // Just(6)
   * const resultAddToNothing = just.filter((x) => x > 10000).apply(maybeAdd).toString() // Nothing()
   * const resultAddNull= just.apply(maybeAddNull).toString() // Nothing()
   * ```
   */
  apply<U extends ((value: T) => any)>(maybe: MaybeShape<U>): ApplicativeResult<T, U>

  /**
   * If need unwrap `Maybe` and call some function and save type without
   * `null` and `undefined` then use caseOf.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const brokenDataMaybe = Maybe.of<number>(null)
   * const normalDataMaybe = Maybe.of(10)
   *
   * const mather: Maybe.CaseOf<number> = {
   *  Just: (x) => x * x,
   *  Nothing: () => -1,
   * }
   *
   * const unwrappedNormal = normalDataMaybe.caseOf(mather) // 100
   * const unwrappedBroken = normalDataMaybe.caseOf(mather) // -1
   *
   * // More example:
   *
   * brokenDataMaybe.caseOf({
   *  Just: (x) => Maybe.of(x * x),
   *  Nothing: () => Maybe.of(-1),
   * }).map((x) => x ^ 2) // Just(1)
   *
   * unwrappedNormal.caseOf({
   *  Just: (x) => Maybe.of(x * x),
   *  Nothing: () => Maybe.of(-1),
   * }).map((x) => x ^ 2) // Nothing
   * ```
   * @param mather This is object with two fields `Just` and `Nothing` what contains functions.
   */
  caseOf<U>(mather: CaseOf<T, U>): U

  /**
   * Unwrap `Maybe` from `Maybe`, if in `Maybe` will not `Maybe` then returns `Nothing`.
   *
   *   _Maybe(Maybe a) -> Maybe a_
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const just = Maybe.of(10)
   * const nestedJust = Maybe.of(just) // Just(Just(10))
   *
   * const backJust = nestedJust.join() // Just(10)
   * const backMoreJust = backJust.join() // Nothing
   * ```
   * */
  join(): JoinMaybe<T>

  /**
   * Checking equals `value` from `Maybe` and what `value` in parameter.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const just = Maybe.of(10)
   *
   * const isSame = equalsValue.equalsValue(10) // true
   * const isEqual = equalsValue.equalsValue(15) // false
   * ```
   * */
  equalsValue(value: Nullable<T>): boolean

  /**
   * Checking equals `value` from `Maybe` and `value` from other `Maybe`.
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const just = Maybe.of(10)
   * const sameJust = Maybe.of(10)
   *
   * const isEqual = equalsValue.equals(sameJust) // true
   * const isMoreEqual = equalsValue.equals(Maybe.of(15)) // false
   * ```
   * */
  equals(value: MaybeShape<T>): boolean
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
  * Create a `Maybe` from any value.
  * If value will `null` or `undefined` this become `Nothing()`
  * else this be `Just(value)`.
  *
  * ```ts
  * import { Maybe } from 'monad-maniac'
  *
  * const foo = Maybe.of<string>(null) // foo will Nothing()
  * const bar = Maybe.of<string>('hello') // bar will Just(hello)
  * ```
  * @typeparam T The type of the item contained in the `Maybe`.
  * @param value The value to wrap in a `Maybe`. If it is `undefined` or `null`,
               the result will be `Nothing`; otherwise it will be Just with value with your type.
  * */
export function of<T>(value: T | null | undefined): MaybeShape<NonNullable<T>> {
  if (value === undefined || value === null) {
    return new Nothing()
  } else {
    return new Just(value as NonNullable<T>)
  }
}

  /**
   * Unwrap `Maybe` from `Maybe`, if in `Maybe` will not `Maybe` then returns `Nothing`.
   *
   *   _Maybe(Maybe a) -> Maybe a_
   *
   * Method like [`MaybeShape.join`](../interfaces/_maybe_.maybeshape.html#join)
   *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const just = Maybe.of(10)
   * const nestedJust = Maybe.of(just) // Just(Just(10))
   *
   * const backJust = Maybe.join(nestedJust) // Just(10)
   * const backMoreJust = Maybe.join(backJust) // Nothing
   * ```
   * */
export function join<T>(value: MaybeShape<T>): JoinMaybe<T> {
  return value.caseOf({
    Just: (x) => x instanceof Just ? x : new Nothing() as JoinMaybe<T>,
    Nothing: () => new Nothing() as JoinMaybe<T>
  }) as JoinMaybe<T>
}

/**
 * Method like [`MaybeShape.apply`](../interfaces/_maybe_.maybeshape.html#apply)
 * but to get maybe and call method `apply` with a function.
 *
 * ```ts
 * import { Maybe } from 'monad-maniac'
 *
 * const foo = Maybe.of(12)
 * const appliedFoo = Maybe.apply(Maybe.of((x) => x * x), foo) // Just(144)
 * ```
 * */
export function apply<T, U extends ((value: T) => any)>(applicative: MaybeShape<U>, maybe: MaybeShape<T>): ApplicativeResult<T, U>
/**
 * Just curried `apply`.
 *
 * _Maybe(a -> b) -> Maybe(a) -> Maybe(b)_
 */
export function apply<T, U extends ((value: T) => any)>(applicative: MaybeShape<U>): (maybe: MaybeShape<T>) => ApplicativeResult<T, U>
export function apply<T, U extends ((value: T) => any)>(applicative: MaybeShape<U>, maybe?: MaybeShape<T>): ApplicativeResult<T, U> | ((maybe: MaybeShape<T>) => ApplicativeResult<T, U>) {
  const op = (m: MaybeShape<T>) => m.apply(applicative)
  return helpers.curry1(op, maybe)
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
export function map<T, U>(f: (value: T) => Nullable<U>, maybe: MaybeShape<T>): MaybeShape<NonNullable<U>>
/**
 * Just curried `map`.
 *
 * _(a -> b) -> Maybe(a) -> Maybe(b)_
 */
export function map<T, U>(f: (value: T) => Nullable<U>): (maybe: MaybeShape<T>) => MaybeShape<NonNullable<U>>
export function map<T, U>(f: (value: T) => Nullable<U>, maybe?: MaybeShape<T>): MaybeShape<NonNullable<U>> | ((maybe: MaybeShape<T>) => MaybeShape<NonNullable<U>>) {
  const op = (m: MaybeShape<T>) => m.map(f)
  return helpers.curry1(op, maybe)
}

/**
 * Method like [`MaybeShape.caseOf`](../interfaces/_maybe_.maybeshape.html#caseof)
 * but to get maybe and call method `caseOf` with a function.
 *
   * ```ts
   * import { Maybe } from 'monad-maniac'
   *
   * const brokenDataMaybe = Maybe.of<number>(null)
   * const normalDataMaybe = Maybe.of(10)
   *
   * const mather: Maybe.CaseOf<number> = {
   *  Just: (x) => x * x,
   *  Nothing: () => -1,
   * }
   *
   * const unwrappedNormal = Maybe.caseOf(mather, brokenDataMaybe) // 100
   * const unwrappedBroken = Maybe.caseOf(mather, normalDataMaybe) // -1
   *
   * // More example:
   *
   * brokenDataMaybe.caseOf({
   *  Just: (x) => Maybe.of(x * x),
   *  Nothing: () => Maybe.of(-1),
   * }).map((x) => x ^ 2) // Just(1)
   *
   * unwrappedNormal.caseOf({
   *  Just: (x) => Maybe.of(x * x),
   *  Nothing: () => Maybe.of(-1),
   * }).map((x) => x ^ 2) // Nothing
   * ```
   * @param mather This is object with two fields `Just` and `Nothing` what contains functions.
 * */
export function caseOf<T, U>(matcher: CaseOf<T, U>, maybe: MaybeShape<T>): U
/**
 * Just curried `caseOf`.
 *
 * _CaseOf a b -> Maybe(a) -> b_
 */
export function caseOf<T, U>(matcher: CaseOf<T, U>): (maybe: MaybeShape<T>) => U
export function caseOf<T, U>(matcher: CaseOf<T, U>, maybe?: MaybeShape<T>): U | ((maybe: MaybeShape<T>) => U) {
  const op = (m: MaybeShape<T>) => m.caseOf(matcher)
  return helpers.curry1(op, maybe)
}

/**
 * Method like [`MaybeShape.chain`](../interfaces/_maybe_.maybeshape.html#chain)
 * but to get maybe and call method `chain` with a function.
 *
 * ```ts
 * import { Maybe } from 'monad-maniac'
 *
 * const foo = Maybe.of(12)
 * const resultFoo = Maybe.chain(foo, (x) => x * x) // 144
 * ```
 * */
export function chain<T, U>(f: (value: T) => U, maybe: MaybeShape<T>): U | undefined
/**
 * Just curried `chain`.
 *
 * _(a -> b) -> Maybe(a) -> b_
 */
export function chain<T, U>(f: (value: T) => U): (maybe: MaybeShape<T>) => U | undefined
export function chain<T, U>(f: (value: T) => U, maybe?: MaybeShape<T>): U | undefined | ((maybe: MaybeShape<T>) => U | undefined) {
  const op = (m: MaybeShape<T>) => m.chain(f)
  return helpers.curry1(op, maybe)
}


/**
 * Method like [`MaybeShape.equals`](../interfaces/_maybe_.maybeshape.html#equals)
 * but to get maybe and call method `equals` with a function.
  *
  * ```ts
  * import { Maybe } from 'monad-maniac'
  *
  * const firstDataMaybe = Maybe.of(10)
  * const secondDataMaybe = Maybe.of(10)
  *
  * const isEqual = Maybe.equals(firstDataMaybe, secondDataMaybe) // true
  * ```
  * */
export function equals<T>(maybeA: MaybeShape<T>, maybeB: MaybeShape<T>): boolean
/**
 * Just curried `equals`.
 *
 * _Maybe(a) -> Maybe(a) -> boolean_
 */
export function equals<T>(maybeA: MaybeShape<T>): (maybeB: MaybeShape<T>) => boolean
export function equals<T>(maybeA: MaybeShape<T>, maybeB?: MaybeShape<T>): boolean | ((maybeB: MaybeShape<T>) => boolean)  {
  const op = (maybeB: MaybeShape<T>): boolean => {
    return maybeA.equals(maybeB)
  }
  return helpers.curry1(op, maybeB)
}

/**
 * Method like [`MaybeShape.equalsValue`](../interfaces/_maybe_.maybeshape.html#equalsvalue)
 * but to get maybe and call method `equalsValue` with a function.
  *
  * ```ts
  * import { Maybe } from 'monad-maniac'
  *
  * const just = Maybe.of(10)
  *
  * const isEqual = Maybe.equalsValue(10, just) // true
  * ```
  * */
export function equalsValue<T>(value: T, maybe: MaybeShape<T>): boolean
/**
 * Just curried `equalsValue`.
 *
 * _a -> Maybe(a) -> boolean_
 */
export function equalsValue<T>(value: T): (maybe: MaybeShape<T>) => boolean
export function equalsValue<T>(value: T, maybe?: MaybeShape<T>): boolean | ((maybeB: MaybeShape<T>) => boolean)  {
  const op = (maybe: MaybeShape<T>): boolean => {
    return maybe.equalsValue(value)
  }
  return helpers.curry1(op, maybe)
}

export class Just<T> implements MaybeShape<T> {
  private value: NonNullable<T>

  constructor(value: T) {
    this.value = value as NonNullable<T>
  }

  /** Method implements from [`MaybeShape.map`](../interfaces/_maybe_.maybeshape.html#map) */
  map<U>(f: (value: NonNullable<T>) => U): MaybeShape<NonNullable<U>> {
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

  /** Method implements from [`MaybeShape.chain`](../interfaces/_maybe_.maybeshape.html#chain) */
  chain<U>(f: (value: T) => U): U {
    return f(this.value)
  }

  filter(f: (value: T) => boolean): MaybeShape<T> {
    return f(this.value) === false ? new Nothing() : this
  }

  /**  Method implements from [`MaybeShape.toString`](../interfaces/_maybe_.maybeshape.html#tostring) */
  toString(): string {
    return `Just(${String(this.value)})`
  }

  /** Method implements from [`MaybeShape.apply`](../interfaces/_maybe_.maybeshape.html#apply) */
  apply<U extends ((value: T) => any)>(maybe: MaybeShape<U>): ApplicativeResult<T, U> {
    return maybe.map((fn) => fn(this.value))
  }

  /** Method implements from [`MaybeShape.caseOf`](../interfaces/_maybe_.maybeshape.html#caseof) */
  caseOf<U>(mather: CaseOf<T, U>): U {
    return mather.Just(this.value)
  }

  /** Method implements from [`MaybeShape.join`](../interfaces/_maybe_.maybeshape.html#join) */
  join(): JoinMaybe<T> {
    return (this.value instanceof Just ? this.value : new Nothing()) as JoinMaybe<T>
  }

  /** Method implements from [`MaybeShape.equalsValue`](../interfaces/_maybe_.maybeshape.html#equalsvalue) */
  equalsValue(value: Nullable<T>): boolean {
    return this.value === value
  }

  /** Method implements from [`MaybeShape.equals`](../interfaces/_maybe_.maybeshape.html#equals) */
  equals(value: MaybeShape<T>): boolean {
    return value.caseOf({
      Just: (x) => x === this.value,
      Nothing: () => false,
    })
  }
}

export class Nothing<T> implements MaybeShape<T> {
  /** Method implements from [`MaybeShape.map`](../interfaces/_maybe_.maybeshape.html#map) */
  map<U>(_f: (value: NonNullable<T>) => U): MaybeShape<NonNullable<U>> {
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

  /** Method implements from [`MaybeShape.chain`](../interfaces/_maybe_.maybeshape.html#chain) */
  chain<U>(_f: (value: T) => U): undefined {
    return undefined
  }

  filter(_f: (value: T) => boolean): MaybeShape<T> {
    return this
  }

  /**  Method implements from [`MaybeShape.toString`](../interfaces/_maybe_.maybeshape.html#tostring) */
  toString(): string {
    return 'Nothing()'
  }

  /** Method implements from [`MaybeShape.apply`](../interfaces/_maybe_.maybeshape.html#apply) */
  apply<U extends ((value: T) => any)>(_maybe: MaybeShape<U>): ApplicativeResult<T, U> {
    return new Nothing()
  }

  /** Method implements from [`MaybeShape.caseOf`](../interfaces/_maybe_.maybeshape.html#caseof) */
  caseOf<U>(mather: CaseOf<T, U>): U {
    return mather.Nothing()
  }

  /** Method implements from [`MaybeShape.join`](../interfaces/_maybe_.maybeshape.html#join) */
  join(): JoinMaybe<T> {
    return new Nothing() as JoinMaybe<T>
  }

  /** Method implements from [`MaybeShape.equalsValue`](../interfaces/_maybe_.maybeshape.html#equalsvalue) */
  equalsValue(value: Nullable<T>): boolean {
    return value === undefined || value === null
  }

  /** Method implements from [`MaybeShape.equals`](../interfaces/_maybe_.maybeshape.html#equals) */
  equals(value: MaybeShape<T>): boolean {
    return value.caseOf({
      Just: () => false,
      Nothing: () => true,
    })
  }
}
