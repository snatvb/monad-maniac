import * as helpers from './helpers'
import * as Maybe from './maybe'
import { Nullable } from './types'
import { Functor } from './interfaces'

/** Mather type for caseOf */
export type CaseOf<L, R, U> = {
  Right: (value: R) => U,
  Left: (value: L) => U,
}

/** This is alias for normal display from context (`Either.Either` => `Either.Shape`) */
export type Shape<L, R> = Either<L, R>

export interface Either<L, R> extends Functor<R> {
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
  /**
   * Returns `true` if it's `Left` and `false` otherwise.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<number, number>(300)
   * const right = Either.right<number, number>(150)
   *
   * const resultLeft = left.isLeft() // true
   * const resultRight = right.isLeft() // false
   * ```
   */
  isLeft(): boolean
  /**
   * Returns `false` if it's `Left` and `true` otherwise.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<number, number>(300)
   * const right = Either.right<number, number>(150)
   *
   * const resultLeft = left.isRight() // false
   * const resultRight = right.isRight() // true
   * ```
   */
  isRight(): boolean
  /**
   * Returns `false` if it's `Left` and `true` otherwise.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<string, number>('Some Error')
   * const right = Either.right<string, number>(150)
   *
   * const matcher: Either.CaseOf<string, number, number> = {
   *   Right: (x) => x * 2,
   *   Left: (message) => message.length,
   * }
   *
   * const resultLeft = left.caseOf(matcher) // 10
   * const resultRight = right.caseOf(matcher) // 300
   * ```
   */
  caseOf<U>(matcher: CaseOf<L, R, U>): U
    /**
   * Converting `Either` to `Maybe`.
   * If value in `Left` will returns `Nothing`, else
   * returns result `Maybe.of` for value from `Right`.
   *
   * ```ts
   * import { Either } from 'monad-maniac'
   *
   * const left = Either.left<string, number>('Some Error')
   * const right = Either.right<string, number>(150)
   * const rightVoid = Either.right<string, number | void>(undefined)
   *
   * const resultLeft = left.toMaybe() // Nothing()
   * const resultRight = right.toMaybe() // Just(150)
   * const resultRightVoid = rightVoid.toMaybe() // Nothing()
   * ```
   */
  toMaybe(): Maybe.Shape<R>
}

/** Alias of  [`Either.right`](../modules/_either_.html#right-2) */
export function of<L, R>(value: R): Either<L, R> {
  return new Right(value)
}

/**
 * Making `Right` from value
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const left = Either.left<string, number>('Some error')
 * ```
 */
export function left<L, R>(value: L): Either<L, R> {
  return new Left(value)
}

/**
 * Making `Right` from value
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const right = Either.right<string, number>(10)
 * ```
 */
export function right<L, R>(value: R): Either<L, R> {
  return new Right(value)
}

/**
 * Returns `Left` or `Right` as `string`.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const right = Either.right<string, number>(10)
 * const left = Either.left<string, number>('Some error')
 *
 * Either.toString(left) // Left(Some error)
 * Either.toString(right) // Right(10)
 * ```
 */
export function toString<L, R>(either: Either<L, R>): string {
  return either.toString()
}

/**
 * Returns `true` if this`Left` or `false` otherwise.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const right = Either.right<string, number>(10)
 * const left = Either.left<string, number>('Some error')
 *
 * Either.isLeft(left) // true
 * Either.isLeft(right) // false
 * ```
 */
export function isLeft<L, R>(either: Either<L, R>): boolean {
  return either.isLeft()
}

/**
 * Returns `true` if this`Right` or `false` otherwise.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const right = Either.right<string, number>(10)
 * const left = Either.left<string, number>('Some error')
 *
 * Either.isRight(left) // false
 * Either.isRight(right) // true
 * ```
 */
export function isRight<L, R>(either: Either<L, R>): boolean {
  return either.isRight()
}

/**
 * Returns `value` from `Left` or `Right`
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const right = Either.right<string, number>(10)
 * const left = Either.left<string, number>('Some error')
 *
 * Either.get(left) // 'Some error'
 * Either.get(right) // 10
 * ```
 */
export function get<L, R>(either: Either<L, R>): L | R {
  return either.get()
}

/**
 * Returns `value` from `Left` or `Right`
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * Either.fromNullable<string, number>(150).toString() // Right(150)
 * Either.fromNullable<string, number>(null).toString() // Left(null)
 * ```
 */
export function fromNullable<L, R>(value: Nullable<R | L>): Either<Nullable<L>, R> {
  if (value === null || value === undefined) {
    return new Left<Nullable<L>, R>(value as Nullable<L>)
  }
  return new Right<L, R>(value as R)
}

/**
 * This is `try {} catch(error) {}` for `Either`.
 * If the function throws exception then the error will
 * catch and placed in `Left`, and in `Right` otherwise.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const errorFunction = (x: number): number => {
 *   if (x === 0) {
 *     throw new Error('Number is zero!')
 *   }
 *   return x
 * }
 *
 * Either.attempt(errorFunction, [0]).map(double).toString() // Left(Error: Number is zero!)
 * Either.attempt(errorFunction, [10]).map(double).toString() // Right(20)
 *
 * ```
 */
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

/**
 * Function like [`Either.attempt`](../modules/_either_.maybeshape.html#attempt)
 * This is async`try {} catch(error) {}` for `Either`.
 * If the function throws exception then the error will
 * catch and placed in `Left`, and in `Right` otherwise.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const errorAsyncFunction = (x: number): Promise<number> => new Promise((resolve, reject) => {
 *   if (x === 0) {
 *     reject(new Error('Number is zero!'))
 *   }
 *   resolve(x)
 * })
 *
 * const left = await Either.asyncAttempt(errorAsyncFunction, [0])
 * const right = await Either.asyncAttempt(errorAsyncFunction, [10])
 * left.map(double).toString() // Left(Error: Number is zero!)
 * right.map(double).toString() // Right(20)
 *
 * ```
 */
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
 * Method like [`Either.map`](../interfaces/_either_.either.html#map)
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

/**
 * Method like [`Either.chain`](../interfaces/_either_.either.html#chain)
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const name: string | void = Math.random() > 0.5 ? 'Jake' : undefined
 * const result: Either.Shape<string, string> = typeof name === 'string'
 *  ? new Either.Right(name)
 *  : new Either.Left('Server error')
 * const greeting = Either.chain((name) => `Welcome, ${name}!`, result) // 'Welcome, Jake' or 'Server error'
 * ```
 * */
export function chain<L, R, U>(f: (value: R) => U, either: Either<L, R>): Either<L, U> | U
/**
 * Just curried `chain`.
 */
export function chain<L, R, U>(f: (value: R) => U): (either: Either<L, R>) => Either<L, U> | U
export function chain<L, R, U>(f: (value: R) => U, either?: Either<L, R>): Either<L, U> | U | ((either: Either<L, R>) => Either<L, U> | U) {
  const op = (either: Either<L, R>) => either.chain(f)
  return helpers.curry1(op, either)
}

/**
 * Method like [`Either.orElse`](../interfaces/_either_.either.html#orelse)
 *
 * Apple some function to `Left` value.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 * const left: Either.Shape<string, number> = new Either.Left('Server error')
 * const right: Either.Shape<string, number> = new Either.Right(150)
 *
 * const orElse = (message: string) => ({ message })
 *
 * Either.orElse(orElse, left) // { message: 'Server error' }
 * Either.orElse(orElse, right) // 150
 * ```
 */
export function orElse<L, R, U>(f: (value: L) => U, either: Either<L, R>): R | U
/**
 * Just curried `orElse`.
 */
export function orElse<L, R, U>(f: (value: L) => U): (either: Either<L, R>) => R | U
export function orElse<L, R, U>(f: (value: L) => U, either?: Either<L, R>): R | U | ((either: Either<L, R>) => R | U) {
  const op = (either: Either<L, R>) => either.orElse(f)
  return helpers.curry1(op, either)
}

/**
 * Method like [`Either.filter`](../interfaces/_either_.either.html#filter)
 *
 * Apple some function to `Right` value and if the function
 * returns not `true` then value will be placed to `Left`.
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 * const right: Either.Shape<number, number> = new Either.Right(150)
 *
 * Either.filter((x) => x > 150, right) // Left(150)
 * Either.filter((x) => x < 300, right) // Right(150)
 * ```
 */
export function filter<L, R>(predicate: (value: R) => boolean, either: Either<L, R>): Either<L | R, R >
/**
 * Just curried `filter`.
 */
export function filter<L, R>(predicate: (value: R) => boolean): (either: Either<L, R>) => Either<L | R, R >
export function filter<L, R>(predicate: (value: R) => boolean, either?: Either<L, R>): Either<L | R, R > | ((either: Either<L, R>) => Either<L | R, R >) {
  const op = (either: Either<L, R>) => either.filter(predicate)
  return helpers.curry1(op, either)
}

/**
 * Method like [`Either.getOrElse`](../interfaces/_either_.either.html#getorelse)
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const left = Either.left<number, number>(150)
 * const right = Either.right<number, number>(150)
 *
 * const resultLeft = Either.getOrElse(0, left) // 0
 * const resultRight = Either.getOrElse(0, right) // 150
 * ```
 */
export function getOrElse<L, R, U>(defaultValue: U, either: Either<L, R>): R | U
/**
 * Just curried `getOrElse`.
 */
export function getOrElse<L, R, U>(defaultValue: U): (either: Either<L, R>) => R | U
export function getOrElse<L, R, U>(defaultValue: U, either?: Either<L, R>): R | U | ((either: Either<L, R>) => R | U) {
  const op = (either: Either<L, R>) => either.getOrElse(defaultValue)
  return helpers.curry1(op, either)
}

/**
 * Method like [`Either.caseOf`](../interfaces/_either_.either.html#caseof)
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const matcher: Either.CaseOf<string, number, number> = {
 *   Right: (x) => x * 2,
 *   Left: (message) => message.length,
 * }
 *
 * const left: Either.Shape<string, number> = new Either.Left('Server error')
 * const right: Either.Shape<string, number> = new Either.Right(150)
 *
 * Either.caseOf(matcher, left) // 12
 * Either.caseOf(matcher, right) // 300
 * ```
 */
export function caseOf<L, R, U>(matcher: CaseOf<L, R, U>, either: Either<L, R>): U
/**
 * Just curried `caseOf`.
 */
export function caseOf<L, R, U>(matcher: CaseOf<L, R, U>): (either: Either<L, R>) => U
export function caseOf<L, R, U>(matcher: CaseOf<L, R, U>, either?: Either<L, R>): U | ((either: Either<L, R>) => U) {
  const op = (either: Either<L, R>) => either.caseOf(matcher)
  return helpers.curry1(op, either)
}

/**
 * Method like [`Either.toMaybe`](../interfaces/_either_.either.html#tomaybe)
 *
 * ```ts
 * import { Either } from 'monad-maniac'
 *
 * const left = Either.left<string, number>('error')
 * const right = Either.right<string, number>(144)
 *
 * const nothing = Either.toMaybe(left)
 * const just = Either.toMaybe(right)
 *
 * ```
 * */
export function toMaybe<L, R>(either: Either<L, R>): Maybe.Shape<R> {
  return either.toMaybe()
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
  toMaybe(): Maybe.Shape<R> {
    return Maybe.of(this.value)
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
  toMaybe(): Maybe.Shape<R> {
    return Maybe.nothing()
  }
}
