
import { Functor } from './interfaces'

export class IO<T extends (...args: any[]) => any> implements Functor<T> {
  private effect: T

  constructor(effect: T) {
    this.effect = effect
  }

  map<U>(fn: (value: ReturnType<T>) => U): IO<() => U> {
    return new IO(() => fn(this.effect()))
  }

  chain<U>(fn: (value: ReturnType<T>) => U): U {
    return fn(this.effect())
  }

  run() {
    return this.effect()
  }

}

export interface Shape<T extends (...args: any[]) => any> extends IO<T> {}

export function of<T>(value: T) {
  return new IO(() => value)
}

export function from(fn: (...args: any[]) => any) {
  return new IO(fn)
}
