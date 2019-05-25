type ApplicativeResult<T, U extends ((value: T) => any)> = Applicative<ReturnType<U>>

export interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>
}

export interface Applicative<T> {
  apply<U extends ((value: T) => any)>(functor: Functor<U>): ApplicativeResult<T, U>
}