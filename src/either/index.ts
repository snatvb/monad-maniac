import { Nullable } from '../types'

export type CaseOf<T, U> = {
  Right: (value: T) => U,
  Left: () => U,
}

export interface Shape<T> {
  map<U>(f: (value: NonNullable<T>) => Nullable<U>): Shape<NonNullable<U>>
  chain<U>(f: (value: T) => U): U | undefined
  filter(f: (value: T) => boolean): Shape<T>
  getOrElse<U>(defaultValue: U): T | U
  toString(): string
  isLeft(): boolean
  isRight(): boolean
  caseOf<U>(matcher: CaseOf<T, U>): U
}
