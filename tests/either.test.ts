import { Either } from '../src'

const double = (x: number): number => x * 2

describe('Either: Left & Right', () => {
  // const foo: string = 'foo'
  // const bar: string = 'bar'
  // const baz: string = 'baz'
  // const randomNumber: number = Math.round(Math.random() * 100)

  it('get', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.get()).toBe('Server error')
    expect(right.get()).toBe(150)
  })

  it('map', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.map(double).get()).toBe('Server error')
    expect(right.map(double).get()).toBe(300)
  })

  it('orElse', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    const orElse = (message: string) => ({ message })

    expect(left.orElse(orElse)).toEqual({ message: 'Server error' })
    expect(right.orElse(orElse)).toBe(150)
  })

  it('chain', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.chain(double)).toBe('Server error')
    expect(right.chain(double)).toBe(300)
  })

  it('getOrElse', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.getOrElse(-1)).toBe(-1)
    expect(right.getOrElse(-1)).toBe(150)
  })

  it('toString', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.toString()).toBe('Left(Server error)')
    expect(right.toString()).toBe('Right(150)')
  })

  it('isLeft', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.isLeft()).toBe(true)
    expect(right.isLeft()).toBe(false)
  })

  it('isRight', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    expect(left.isRight()).toBe(false)
    expect(right.isRight()).toBe(true)
  })
})