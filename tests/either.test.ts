import { Either } from '../src'

const double = (x: number): number => x * 2

describe('Either pure functions', () => {
  describe('get', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.get(left)).toBe('Server error')
      expect(Either.get(right)).toBe(150)
    })
  })

  describe('map', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.map(double, left).get()).toBe('Server error')
      expect(Either.map(double, right).get()).toBe(300)
    })

    it('carried', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.map(double)(left).get()).toBe('Server error')
      expect(Either.map(double)(right).get()).toBe(300)
    })
  })

  describe('orElse', () => {
    const orElse = (message: string) => ({ message })

    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.orElse(orElse, left)).toEqual({ message: 'Server error' })
      expect(Either.orElse(orElse, right)).toBe(150)
    })

    it('carried', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.orElse(orElse)(left)).toEqual({ message: 'Server error' })
      expect(Either.orElse(orElse)(right)).toBe(150)
    })
  })
})

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

  it('caseOf', () => {
    const left: Either.Shape<string, number> = new Either.Left('Server error')
    const right: Either.Shape<string, number> = new Either.Right(150)

    const matcher: Either.CaseOf<string, number, number> = {
      Right: double,
      Left: (message) => message.length,
    }

    expect(left.caseOf(matcher)).toBe(12)
    expect(right.caseOf(matcher)).toBe(300)
  })
})