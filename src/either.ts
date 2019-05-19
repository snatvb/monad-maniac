// import * as helpers from './helpers'
// import { Nullable } from './types'

export type CaseOf<L, R, U> = {
  Right: (value: R) => U,
  Left: (value: L) => U,
}

export interface Shape<L, R> {
  map<U>(f: (value: R) => U): Shape<L, U>
  chain<U>(f: (value: R) => U): U | L
  filter(predicate: (value: R) => boolean): Shape<L | R, R >
  getOrElse<U>(defaultValue: U): R | U
  get(): L | R
  toString(): string
  isLeft(): boolean
  isRight(): boolean
  caseOf<U>(matcher: CaseOf<L, R, U>): U
}

export function of<L, R>(value: R): Shape<L, R> {
  return new Right(value)
}

export function fromNullable<L, R>(value: R | L): Shape<L, R> {
  if (value === null || value === undefined) {
    return new Left<L, R>(value as L)
  }
  return new Right<L, R>(value as R)
}

export class Right<L ,R> implements Shape<L ,R> {
  private value: R

  constructor(value: R) {
    this.value = value
  }

  map<U>(f: (value: R) => U): Shape<L, U> {
    return of(f(this.value))
  }

  chain<U>(f: (value: R) => U): U | L {
    return f(this.value)
  }

  filter(predicate: (value: R) => boolean): Shape<L | R, R > {
    if (predicate(this.value) === true) {
      return this as Shape<L, R>
    }
    return new Left<R, R>(this.value)
  }
  getOrElse<U>(_defaultValue: U): R | U {
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

class Left<L, R> implements  Shape<L, R> {
  private value: L

  constructor(value: L) {
    this.value = value
  }

  map<U>(_f: (value: R) => U): Shape<L, U> {
    return new Left<L, U>(this.value)
  }

  chain<U>(_f: (value: R) => U): U | L {
    return this.value
  }

  filter(_predicate: (value: R) => boolean): Shape<L | R, R > {
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
