import { Either } from '../src'

const double = (x: number): number => x * 2

describe('Either pure functions', () => {
  describe('of', () => {
    it('direct call', () => {
      expect(Either.of(150).toString()).toBe('Right(150)')
      expect(Either.of('right').toString()).toBe('Right(right)')
    })
  })

  describe('fromNullable', () => {
    it('direct call', () => {
      expect(Either.fromNullable<string, number>(150).toString()).toBe('Right(150)')
      expect(Either.fromNullable<string, string>('right').toString()).toBe('Right(right)')
      expect(Either.fromNullable<string, string>(null).toString()).toBe('Left(null)')
      expect(Either.fromNullable<string, string>(undefined).toString()).toBe('Left(undefined)')
      expect(Either.fromNullable<string, string>(undefined).orElse(() => Either.of('gog')).toString()).toBe('Right(gog)')
    })
  })

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

  describe('chain', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.chain(double, left)).toBe('Server error')
      expect(Either.chain(double, right)).toBe(300)
    })

    it('carried', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.chain(double)(left)).toBe('Server error')
      expect(Either.chain(double)(right)).toBe(300)
    })
  })

  describe('getOrElse', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.getOrElse('no-o-o', left)).toBe('no-o-o')
      expect(Either.getOrElse('no-o-o', right)).toBe(150)
    })

    it('carried', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.getOrElse('no-o-o')(left)).toBe('no-o-o')
      expect(Either.getOrElse('no-o-o')(right)).toBe(150)
    })
  })

  describe('toString', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.toString(left)).toBe('Left(Server error)')
      expect(Either.toString(right)).toBe('Right(150)')
    })
  })

  describe('isLeft', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.isLeft(left)).toBe(true)
      expect(Either.isLeft(right)).toBe(false)
    })
  })

  describe('isRight', () => {
    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.isRight(left)).toBe(false)
      expect(Either.isRight(right)).toBe(true)
    })
  })

  describe('caseOf', () => {
    const matcher: Either.CaseOf<string, number, number> = {
      Right: double,
      Left: (message) => message.length,
    }

    it('direct call', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.caseOf(matcher, left)).toBe(12)
      expect(Either.caseOf(matcher, right)).toBe(300)
    })

    it('carried', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)

      expect(Either.caseOf(matcher)(left)).toBe(12)
      expect(Either.caseOf(matcher)(right)).toBe(300)
    })
  })

  describe('filter', () => {
    const predicate = (x: number) => x > 150

    it('direct call', () => {
      const left: Either.Shape<number, number> = new Either.Left(150)
      const right: Either.Shape<number, number> = new Either.Right(150)

      expect(Either.filter(predicate, left.map(double)).isLeft()).toBe(true)
      expect(Either.filter(predicate, right).isLeft()).toBe(true)
      expect(Either.filter(predicate, right.map(double)).isRight()).toBe(true)
    })

    it('carried', () => {
      const left: Either.Shape<number, number> = new Either.Left(150)
      const right: Either.Shape<number, number> = new Either.Right(150)

      expect(Either.filter(predicate)(left.map(double)).isLeft()).toBe(true)
      expect(Either.filter(predicate)(right).isLeft()).toBe(true)
      expect(Either.filter(predicate)(right.map(double)).isRight()).toBe(true)
    })
  })

  describe('attempt', () => {
    const errorFunction = (x: number): number => {
      if (x === 0) {
        throw new Error('Number is zero!')
      }
      return x
    }

    it('direct call', () => {
      expect(Either.attempt(errorFunction, [0]).map(double).toString()).toBe('Left(Error: Number is zero!)')
      expect(Either.attempt(errorFunction, [10]).map(double).toString()).toBe('Right(20)')
    })

    it('carried', () => {
      expect(Either.attempt(errorFunction)([0]).map(double).toString()).toBe('Left(Error: Number is zero!)')
      expect(Either.attempt(errorFunction)([10]).map(double).toString()).toBe('Right(20)')
    })
  })

  describe('asyncAttempt', () => {
    const errorAsyncFunction = (x: number): Promise<number> => new Promise((resolve, reject) => {
      if (x === 0) {
        reject(new Error('Number is zero!'))
      }
      resolve(x)
    })

    it('direct call', async () => {
      const left = await Either.asyncAttempt(errorAsyncFunction, [0])
      const right = await Either.asyncAttempt(errorAsyncFunction, [10])
      expect(left.map(double).toString()).toBe('Left(Error: Number is zero!)')
      expect(right.map(double).toString()).toBe('Right(20)')
    })

    it('carried', async () => {
      const leftErrorFn = Either.asyncAttempt(errorAsyncFunction)
      const rightErrorFn = Either.asyncAttempt(errorAsyncFunction)
      const left = await leftErrorFn([0])
      const right = await rightErrorFn([10])
      expect(left.map(double).toString()).toBe('Left(Error: Number is zero!)')
      expect(right.map(double).toString()).toBe('Right(20)')
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

  it('filter', () => {
    const predicate = (x: number) => x > 150
    const left: Either.Shape<number, number> = new Either.Left(150)
    const right: Either.Shape<number, number> = new Either.Right(150)

    expect(left.map(double).filter(predicate).isLeft()).toBe(true)
    expect(right.filter(predicate).isLeft()).toBe(true)
    expect(right.map(double).filter(predicate).isRight()).toBe(true)
    expect(right.filter(predicate).map(double).isLeft()).toBe(true)
  })
})