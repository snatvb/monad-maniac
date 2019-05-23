import { Either } from '../src'

const double = (x: number): number => x * 2

describe('Either pure functions', () => {
  describe('of', () => {
    it('direct call', () => {
      expect(Either.of(150).toString()).toBe('Right(150)')
      expect(Either.of('right').toString()).toBe('Right(right)')
    })
  })

  describe('left', () => {
    it('direct call', () => {
      expect(Either.left<string, number>('Server Error').toString()).toBe('Left(Server Error)')
    })
  })

  describe('right', () => {
    it('direct call', () => {
      expect(Either.right<string, number>(10).toString()).toBe('Right(10)')
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
      const leftResult = Either.chain(double, left)

      expect(leftResult instanceof Either.Left).toBe(true)
      expect(Either.chain(double, right)).toBe(300)
    })

    it('carried', () => {
      const left: Either.Shape<string, number> = new Either.Left('Server error')
      const right: Either.Shape<string, number> = new Either.Right(150)
      const leftResult = Either.chain(double)(left)

      expect(leftResult instanceof Either.Left).toBe(true)
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

    expect(left.chain(double) instanceof Either.Left).toBe(true)
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

describe('Cases from docs', () => {
  it('map', () => {
    const divide = (dividend: number) => (divider: number): Either.Shape<string, number> => {
     if (divider === 0) {
       return Either.left('Divider is zero!')
     }
     return Either.right(dividend / divider)
    }

    const resultNormal = divide(10)(5).map(double).get() // 4
    const resultErrorDivide = divide(10)(0).map(double).get() // 'Divider is zero!'
    expect(resultNormal).toBe(4)
    expect(resultErrorDivide).toBe('Divider is zero!')
  })

  it('chain', () => {
    const divide = (dividend: number) => (divider: number): Either.Shape<string, number> => {
     if (divider === 0) {
       return Either.left('Divider is zero!')
     }
     return Either.right(dividend / divider)
    }

    const nonZeroMultiply = (multiplicand: number) => (factor: number): Either.Shape<string, number> => {
      if (factor === 0) {
        return Either.left('Factor is zero!')
      }
      return Either.right(multiplicand * factor)
    }

    const resultNormal = divide(10)(2).chain(nonZeroMultiply(20)).get() // 100
    const resultErrorDivide = divide(10)(0).chain(nonZeroMultiply(20)).get() // 'Divider is zero!'
    const resultErrorMultiply = divide(0)(2).chain(nonZeroMultiply(20)).get() // 'Factor is zero!'
    const resultError = divide(0)(0).chain(nonZeroMultiply(20)).get() // 'Divider is zero!'
    expect(resultNormal).toBe(100)
    expect(resultErrorDivide).toBe('Divider is zero!')
    expect(resultErrorMultiply).toBe('Factor is zero!')
    expect(resultError).toBe('Divider is zero!')
  })

  it('orElse', () => {
    const left = Either.left<Error, string>(new Error('Some error'))
    const right = Either.right<Error, string>('Jake')

    const resultLeft = left.orElse((error) => error.message) // Some error
    const resultRight = right.orElse((error) => error.message) // Jake

    expect(resultLeft).toBe('Some error')
    expect(resultRight).toBe('Jake')
  })

  it('filter', () => {
    const example = Either.right<number, number>(0)
    const result = example.filter((x) => x !== 0).map((x) => 1 / x).get() // 0

    expect(result).toBe(0)
  })

  it('getOrElse', () => {
    const left = Either.left<number, number>(150)
    const right = Either.right<number, number>(150)

    const resultLeft = left.getOrElse(0) // 0
    const resultRight = right.getOrElse(0) // 150

    expect(resultLeft).toBe(0)
    expect(resultRight).toBe(150)
  })

  it('get', () => {
    const left = Either.left<number, number>(300)
    const right = Either.right<number, number>(150)

    const resultLeft = left.toString() // Left(300)
    const resultRight = right.toString() // Right(150)

    expect(resultLeft).toBe('Left(300)')
    expect(resultRight).toBe('Right(150)')
  })

  it('isLeft', () => {
    const left = Either.left<number, number>(300)
    const right = Either.right<number, number>(150)

    const resultLeft = left.isLeft() // true
    const resultRight = right.isLeft() // false

    expect(resultLeft).toBe(true)
    expect(resultRight).toBe(false)
  })

  it('isRight', () => {
    const left = Either.left<number, number>(300)
    const right = Either.right<number, number>(150)

    const resultLeft = left.isRight() // false
    const resultRight = right.isRight() // true

    expect(resultLeft).toBe(false)
    expect(resultRight).toBe(true)
  })

  it('caseOf', () => {
    const left = Either.left<string, number>('Some Error')
    const right = Either.right<string, number>(150)

    const matcher: Either.CaseOf<string, number, number> = {
      Right: (x) => x * 2,
      Left: (message) => message.length,
    }

    const resultLeft = left.caseOf(matcher) // 10
    const resultRight = right.caseOf(matcher) // 300

    expect(resultLeft).toBe(10)
    expect(resultRight).toBe(300)
  })

  it('toMaybe', () => {
    const left = Either.left<string, number>('Some Error')
    const right = Either.right<string, number>(150)
    const rightVoid = Either.right<string, number | void>(undefined)

    const resultLeft = left.toMaybe() // Nothing()
    const resultRight = right.toMaybe() // Just(150)
    const resultRightVoid = rightVoid.toMaybe() // Nothing()
    expect(resultLeft.toString()).toBe('Nothing()')
    expect(resultRight.toString()).toBe('Just(150)')
    expect(resultRightVoid.toString()).toBe('Nothing()')
  })
})
