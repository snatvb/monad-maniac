/** [[include:doc/io.md]] */

/** Fix tsdoc */
import { Functor } from './interfaces'
import * as helpers from './helpers'

export class IO<T extends (...args: any[]) => any> implements Functor<T> {
  private effect: T

  constructor(effect: T) {
    this.effect = effect
  }

  /**
   * This method running function from `IO` and result will be referred to
   * `fn` function. Result from `fn` function will be wrapped up into `IO`.
   */
  map<U>(fn: (value: ReturnType<T>) => U): IO<() => U> {
    return new IO(() => fn(this.effect()))
  }

  /**
   * Same like `map`, but...
   * Result from `fn` function will **not** be wrapped up into `IO`.
   */
  chain<U>(fn: (value: ReturnType<T>) => U): U {
    return fn(this.effect())
  }

  /** To run function from `IO` */
  run(): ReturnType<T> {
    return this.effect()
  }

}

/** This need just use with context `IO.Shape<T>` instead of `IO.IO<T>` */
export interface Shape<T extends (...args: any[]) => any> extends IO<T> {}

/**
 * This function are getting some value and contains it
 * in function where the function will returns the value (`() => value` )
 * */
export function of<T>(value: T) {
  return new IO(() => value)
}

/** Making `IO` monad from function */
export function from(fn: (...args: any[]) => any) {
  return new IO(fn)
}

/** Calling method `run` from `IO` instance */
export function run<T extends (...args: any[]) => any>(io: IO<T>): ReturnType<T> {
  return io.run()
}

/**
 * Method like [`IO.map`](../interfaces/_io_.io.html#map)
 * but to get `IO` and call method `map` with a function.
 *
 * */
export function map<T extends (...args: any[]) => any, U>(fn: (value: ReturnType<T>) => U, io: IO<T>): IO<() => U>
/**
 * Just curried `map`.
 *
 * _(a -> b) -> IO(a) -> IO(b)_
 */
export function map<T extends (...args: any[]) => any, U>(fn: (value: ReturnType<T>) => U): (io: IO<T>) => IO<() => U>
export function map<T extends (...args: any[]) => any, U>(fn: (value: ReturnType<T>) => U, io?: IO<T>): IO<() => U> | ((io: IO<T>) => IO<() => U>) {
  const op = (functor: IO<T>) => functor.map(fn)
  return helpers.curry1(op, io)
}

/**
 * Method like [`IO.chain`](../interfaces/_io_.io.html#chain)
 * but to get `IO` and call method `chain` with a function.
 *
 * */
export function chain<T extends (...args: any[]) => any, U>(fn: (value: ReturnType<T>) => U, io: IO<T>): U
/**
 * Just curried `chain`.
 *
 * _(a -> b) -> IO(a) -> b_
 */
export function chain<T extends (...args: any[]) => any, U>(fn: (value: ReturnType<T>) => U): (io: IO<T>) => U
export function chain<T extends (...args: any[]) => any, U>(fn: (value: ReturnType<T>) => U, io?: IO<T>): U | ((io: IO<T>) => U) {
  const op = (functor: IO<T>) => functor.chain(fn)
  return helpers.curry1(op, io)
}
