import * as helpers from './helpers'
import { Nullable } from './types'

export type CaseOf<L, R, U> = {
  Right: (value: R) => U,
  Left: (value: L) => U,
}

/** This is alias for normal display from context (`Either.Either` => `Either.Shape`) */
export type Shape<L, R> = Either<L, R>

export interface Either<L, R> {
  /**
   * Apply some function to value in container. `map` for `Right`
   * will call the function with value, for `Left` return `Left`.
   * If `map` will return `null` or `undefined` then return `Right` with that.
   * Be careful.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const divide = (dividend: number) => (divider: number): Either.Shape<string, number> => {
   * if (divider === 0) {
   *   return Either.left('Divider is zero!')
   * }
   *  return Either.right(dividend / divider)
   * }
   *
   * const resultNormal = divide(10)(5).map(double).get() // 4
   * const resultErrorDivide = divide(10)(0).map(double).get() // 'Divider is zero!'
   * ```
   *
   * @param f Function to apply for Right value
   */
  map<U>(f: (value: R) => U): Either<L, U>
    /**
   * Apply some function to value in container `Left`. Like `map` for `Right`.
   *
   * The methods returns result from function or value from `Right`.
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<Error, string>(new Error('Some error'))
   * const right = Either.right<Error, string>('Jake')
   *
   * const resultLeft = left.orElse((error) => error.message) // Some error
   * const resultRight = right.orElse((error) => error.message) // Jake
   * ```
   *
   * @param f Function to apply for Right value
   */
  orElse<U>(f: (value: L) => U): U | R
  /**
   * Apply some function to value in container. `map` for `Right`
   * will call the function with value, for `Left` return `Left`
   * else value what be returned from the function.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const divide = (dividend: number) => (divider: number): Either.Shape<string, number> => {
   *  if (divider === 0) {
   *    return Either.left('Divider is zero!')
   *  }
   *  return Either.right(dividend / divider)
   * }
   *
   * const nonZeroMultiply = (multiplicand: number) => (factor: number): Either.Shape<string, number> => {
    *  if (factor === 0) {
    *    return Either.left('Factor is zero!')
    *  }
    *  return Either.right(multiplicand * factor)
   * }
   *
   * const resultNormal = divide(10)(2).chain(nonZeroMultiply(20)).get() // 100
   * const resultErrorDivide = divide(10)(0).chain(nonZeroMultiply(20)).get() // 'Divider is zero!'
   * const resultErrorMultiply= divide(0)(2).chain(nonZeroMultiply(20)).get() // 'Factor is zero!'
   * const resultError = divide(0)(0).chain(nonZeroMultiply(20)).get() // 'Divider is zero!'
   *
   * ```
   * @param f Function to apply for Right value
   */
  chain<U>(f: (value: R) => U): U | Either<L, U>
  /**
   * Apply predicate function to value in container.
   * If the function returns not `true` then value from
   * `Right` will be transferred to `Left`.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const example = Either.right<number, number>(0)
   * const result = example.filter((x) => x !== 0).map((x) => 1 / x).get() // 0
   * ```
   */
  filter(predicate: (value: R) => boolean): Either<L | R, R>
  /**
   * If `Either` is `Left` returns `defaultValue` and returns `value` from `Right` otherwise.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<number, number>(150)
   * const right = Either.right<number, number>(150)
   *
   * const resultLeft = left.getOrElse(0) // 0
   * const resultRight = right.getOrElse(0) // 150
   * ```
   */
  getOrElse<U>(defaultValue: U): R | U
  /**
   * Just returns `value` from `Right` or `Left`
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<number, number>(300)
   * const right = Either.right<number, number>(150)
   *
   * const resultLeft = left.get() // 300
   * const resultRight = right.get() // 150
   * ```
   */
  get(): L | R
  /**
   * Returns `Left` or `Right` as `string`: `Left(left value)` or `Right(right value)`.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<number, number>(300)
   * const right = Either.right<number, number>(150)
   *
   * const resultLeft = left.toString() // Left(300)
   * const resultRight = right.toString() // Right(150)
   * ```
   */
  toString(): string
  isLeft(): boolean
  isRight(): boolean
  caseOf<U>(matcher: CaseOf<L, R, U>): U
}

export function of<L, R>(value: R): Either<L, R> {
  return new Right(value)
}

export function left<L, R>(value: L): Either<L, R> {
  return new Left(value)
}

export function right<L, R>(value: R): Either<L, R> {
  return new Right(value)
}

export function toString<L, R>(either: Either<L, R>): string {
  return either.toString()
}

export function isLeft<L, R>(either: Either<L, R>): boolean {
  return either.isLeft()
}

export function isRight<L, R>(either: Either<L, R>): boolean {
  return either.isRight()
}

export function get<L, R>(either: Either<L, R>): L | R {
  return either.get()
}

export function fromNullable<L, R>(value: Nullable<R | L>): Either<Nullable<L>, R> {
  if (value === null || value === undefined) {
    return new Left<Nullable<L>, R>(value as Nullable<L>)
  }
  return new Right<L, R>(value as R)
}

export function attempt<R>(f: (...args: any[]) => R, args: any[]): Either<Error, R>
export function attempt<R>(f: (...args: any[]) => R): (args: any[]) => Either<Error, R>
export function attempt<R>(f: (...args: any[]) => R, args?: any[]): Either<Error, R> | ((args: any[]) => Either<Error, R>) {
  const op = (args: any[]) => {
    try {
      return new Right<Error, R>(f(...args))
    } catch(error) {
      return new Left<Error, R>(error)
    }
  }
  return helpers.curry1(op, args)
}

export function asyncAttempt<R>(f: (...args: any[]) => Promise<R>, args: any[]): Promise<Either<Error, R>>
export function asyncAttempt<R>(f: (...args: any[]) => Promise<R>): (args: any[]) => Promise<Either<Error, R>>
export function asyncAttempt<R>(f: (...args: any[]) => Promise<R>, args?: any[]): Promise<Either<Error, R>> | ((args: any[]) => Promise<Either<Error, R>>) {
  const op = async (args: any[]) => {
    try {
      return new Right<Error, R>(await f(...args))
    } catch(error) {
      return new Left<Error, R>(error)
    }
  }
  return helpers.curry1(op, args)
}

/**
 * Method like [`Either.map`](../interfaces/_either_.shape.html#map)
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const name: string | void = Math.random() > 0.5 ? 'Jake' : undefined
 * const result: Either.Shape<string, string> = typeof name === 'string'
 *  ? new Either.Right(name)
 *  : new Either.Left('Server error')
 * const greeting = Either.map((name) => `Welcome, ${name}!`, result)
 *
 * // ...
 *
 * if (greeting.isLeft()) {
 *  console.error(greeting.get())
 * } else {
 *  showGreeting(greeting.get())
 * }
 *
 * ```
 * */
export function map<L, R, U>(f: (value: R) => U, either: Either<L, R>): Either<L, U>
/**
 * Just curried `map`.
 */
export function map<L, R, U>(f: (value: R) => U): (either: Either<L, R>) => Either<L, U>
export function map<L, R, U>(f: (value: R) => U, either?: Either<L, R>): Either<L, U> | ((either: Either<L, R>) => Either<L, U>) {
  const op = (either: Either<L, R>) => either.map(f)
  return helpers.curry1(op, either)
}

export function chain<L, R, U>(f: (value: R) => U, either: Either<L, R>): Either<L, U> | U
/**
 * Just curried `chain`.
 */
export function chain<L, R, U>(f: (value: R) => U): (either: Either<L, R>) => Either<L, U> | U
export function chain<L, R, U>(f: (value: R) => U, either?: Either<L, R>): Either<L, U> | U | ((either: Either<L, R>) => Either<L, U> | U) {
  const op = (either: Either<L, R>) => either.chain(f)
  return helpers.curry1(op, either)
}

export function orElse<L, R, U>(f: (value: L) => U, either: Either<L, R>): R | U
/**
 * Just curried `orElse`.
 */
export function orElse<L, R, U>(f: (value: L) => U): (either: Either<L, R>) => R | U
export function orElse<L, R, U>(f: (value: L) => U, either?: Either<L, R>): R | U | ((either: Either<L, R>) => R | U) {
  const op = (either: Either<L, R>) => either.orElse(f)
  return helpers.curry1(op, either)
}

export function filter<L, R>(predicate: (value: R) => boolean, either: Either<L, R>): Either<L | R, R >
/**
 * Just curried `filter`.
 */
export function filter<L, R>(predicate: (value: R) => boolean): (either: Either<L, R>) => Either<L | R, R >
export function filter<L, R>(predicate: (value: R) => boolean, either?: Either<L, R>): Either<L | R, R > | ((either: Either<L, R>) => Either<L | R, R >) {
  const op = (either: Either<L, R>) => either.filter(predicate)
  return helpers.curry1(op, either)
}

export function getOrElse<L, R, U>(defaultValue: U, either: Either<L, R>): R | U
/**
 * Just curried `getOrElse`.
 */
export function getOrElse<L, R, U>(defaultValue: U): (either: Either<L, R>) => R | U
export function getOrElse<L, R, U>(defaultValue: U, either?: Either<L, R>): R | U | ((either: Either<L, R>) => R | U) {
  const op = (either: Either<L, R>) => either.getOrElse(defaultValue)
  return helpers.curry1(op, either)
}

export function caseOf<L, R, U>(matcher: CaseOf<L, R, U>, either: Either<L, R>): U
/**
 * Just curried `caseOf`.
 */
export function caseOf<L, R, U>(matcher: CaseOf<L, R, U>): (either: Either<L, R>) => U
export function caseOf<L, R, U>(matcher: CaseOf<L, R, U>, either?: Either<L, R>): U | ((either: Either<L, R>) => U) {
  const op = (either: Either<L, R>) => either.caseOf(matcher)
  return helpers.curry1(op, either)
}

export class Right<L ,R> implements Either<L ,R> {
  private value: R

  constructor(value: R) {
    this.value = value
  }

  map<U>(f: (value: R) => U): Either<L, U> {
    return of(f(this.value))
  }

  orElse<U>(_f: (value: L) => U): U | R {
    return this.value
  }

  chain<U>(f: (value: R) => U): U | Either<L, U> {
    return f(this.value)
  }

  filter(predicate: (value: R) => boolean): Either<L | R, R > {
    if (predicate(this.value) === true) {
      return this as Either<L, R>
    }
    return new Left<R, R>(this.value)
  }
  getOrElse<U>(_defaultValue: U): R {
    return this.value
  }
  get(): L | R {
    return this.value
  }
  toString(): string {
    return `Right(${String(this.value)})`
  }
  isLeft(): boolean {
    return false
  }
  isRight(): boolean {
    return true
  }
  caseOf<U>(matcher: CaseOf<L, R, U>): U {
    return matcher.Right(this.value)
  }
}

export class Left<L, R> implements  Either<L, R> {
  private value: L

  constructor(value: L) {
    this.value = value
  }

  map<U>(_f: (value: R) => U): Either<L, U> {
    return new Left<L, U>(this.value)
  }

  orElse<U>(f: (value: L) => U): U {
    return f(this.value)
  }

  chain<U>(_f: (value: R) => U): U | Either<L, U> {
    return new Left<L, U>(this.value)
  }

  filter(_predicate: (value: R) => boolean): Either<L | R, R > {
    return this
  }
  getOrElse<U>(defaultValue: U): R | U {
    return defaultValue
  }
  get(): L | R {
    return this.value
  }
  toString(): string {
    return `Left(${String(this.value)})`
  }
  isLeft(): boolean {
    return true
  }
  isRight(): boolean {
    return false
  }
  caseOf<U>(matcher: CaseOf<L, R, U>): U {
    return matcher.Left(this.value)
  }
}
