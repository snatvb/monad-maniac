import * as helpers from './helpers'
// import { Nullable } from './types'

export type CaseOf<L, R, U> = {
  Right: (value: R) => U,
  Left: (value: L) => U,
}

/** This is alias for normal display from context (`Either.Either` => `Either.Shape`) */
export type Shape<L, R> = Either<L, R>

export interface Either<L, R> {
  map<U>(f: (value: R) => U): Either<L, U>
  orElse<U>(f: (value: L) => U): U | R
  chain<U>(f: (value: R) => U): U | L
  filter(predicate: (value: R) => boolean): Either<L | R, R >
  getOrElse<U>(defaultValue: U): R | U
  get(): L | R
  toString(): string
  isLeft(): boolean
  isRight(): boolean
  caseOf<U>(matcher: CaseOf<L, R, U>): U
}

export function of<L, R>(value: R): Either<L, R> {
  return new Right(value)
}

export function fromNullable<L, R>(value: R | L): Either<L, R> {
  if (value === null || value === undefined) {
    return new Left<L, R>(value as L)
  }
  return new Right<L, R>(value as R)
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
 * : new Either.Left('Server error')
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
 *
 * _(a -> b) -> Either(a) -> Either(b)_
 */
export function map<L, R, U>(f: (value: R) => U): (either: Either<L, R>) => Either<L, U>
export function map<L, R, U>(f: (value: R) => U, either?: Either<L, R>): Either<L, U> | ((either: Either<L, R>) => Either<L, U>) {
  const op = (either: Either<L, R>) => either.map(f)
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

  chain<U>(f: (value: R) => U): U | L {
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
    return true
  }
  isRight(): boolean {
    return false
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

  chain<U>(_f: (value: R) => U): U | L {
    return this.value
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
