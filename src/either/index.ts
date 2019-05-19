import { Nullable } from '../types'

export type CaseOf<L, R> = {
  Right: (value: R) => L,
  Left: () => L,
}

export interface Shape<L, R> {
  map<U>(f: (value: NonNullable<R>) => Nullable<U>): Shape<L, NonNullable<U>>
  chain<U>(f: (value: R) => U): U | undefined
  filter(f: (value: R) => boolean): Shape<L, R>
  getOrElse<U>(defaultValue: U): R | U
  get(): L | R
  toString(): string
  isLeft(): boolean
  isRight(): boolean
  caseOf<U>(matcher: CaseOf<R, U>): U
}
