import { Maybe } from '../src'

const double = (x: number): number => x * 2
const doubleChain = (x: number) => Maybe.of(x * 2)
const concat = (a: string) => (b: string): string => `${b}${a}`
const concatChain = (a: string) => (b: string) => Maybe.of(`${b}${a}`)
const toNothing = (): undefined | number => undefined
const toNothingChain = () => Maybe.of(undefined)
const toNull = (): null | number => null

describe('Pure functions', () => {
  describe('Maybe.of', () => {
    it('with null', () => {
      const nothing = Maybe.of(null)
      expect(nothing.toString()).toBe('Nothing()')
    })

    it('with undefined', () => {
      const nothing = Maybe.of(undefined)
      expect(nothing.toString()).toBe('Nothing()')
    })

    it('with number', () => {
      const just = Maybe.of(10)
      expect(just.toString()).toBe('Just(10)')
    })

    it('with string', () => {
      const just = Maybe.of('foo')
      expect(just.toString()).toBe('Just(foo)')
    })

    it('with object', () => {
      const just = Maybe.of({ foo: 'bar' })
      expect(just.toString()).toBe('Just([object Object])')
    })
  })

  describe('map', () => {
    it('with value', () => {
      const just = Maybe.of('foo')
      expect(Maybe.map(concat('bar'), just).toString()).toBe('Just(foobar)')
    })

    it('with null', () => {
      const just = Maybe.of(234)
      const nothing = Maybe.of(null)
      const nothing2 = Maybe.of(undefined)
      expect(Maybe.map(toNothing, just).toString()).toBe('Nothing()')
      expect(Maybe.map(double, nothing).toString()).toBe('Nothing()')
      expect(Maybe.map(double, nothing2).toString()).toBe('Nothing()')
    })

    it('carry', () => {
      const just = Maybe.of('foo')
      const carried = Maybe.map(concat('bar'))
      expect(typeof carried).toBe('function')
      expect(carried(just).toString()).toBe('Just(foobar)')
    })
  })

  describe('chain', () => {
    it('with value', () => {
      const just = Maybe.of('foo')
      expect(Maybe.chain(concatChain('bar'), just).getOrElse(undefined)).toBe(
        'foobar',
      )
    })

    it('with null and undefined', () => {
      const just = Maybe.of(234)
      const nothing = Maybe.of(null)
      const nothing2 = Maybe.of(undefined)
      const chained1 = Maybe.chain((x) => Maybe.of(x), nothing)
      const chained2 = Maybe.chain((x) => Maybe.of(x), nothing2)
      expect(
        Maybe.chain(toNothingChain, just).getOrElse(undefined),
      ).toBeUndefined()
      expect(chained1.getOrElse(undefined)).toBe(undefined)
      expect(chained2.getOrElse(undefined)).toBe(undefined)
    })

    it('carry', () => {
      const just = Maybe.of('foo')
      const carried = Maybe.chain(concatChain('bar'))
      expect(typeof carried).toBe('function')
      expect(carried(just).getOrElse(undefined)).toBe('foobar')
    })
  })

  describe('apply', () => {
    const maybeConcat = Maybe.of(concat('bar'))
    it('with value', () => {
      const just = Maybe.of('foo')
      expect(Maybe.apply(maybeConcat, just).toString()).toBe('Just(foobar)')
    })

    it('with null', () => {
      const maybeDouble = Maybe.of(double)
      const nothing = Maybe.of(null)
      const nothing2 = Maybe.of(undefined)
      expect(Maybe.apply(maybeDouble, nothing).toString()).toBe('Nothing()')
      expect(Maybe.apply(maybeDouble, nothing2).toString()).toBe('Nothing()')
    })

    it('carry', () => {
      const just = Maybe.of('foo')
      const carried = Maybe.apply<string, (v: string) => string>(maybeConcat)
      expect(typeof carried).toBe('function')
      expect(carried(just).toString()).toBe('Just(foobar)')
    })
  })

  describe('getOrElse', () => {
    it('with value', () => {
      const just = Maybe.of('foo')
      expect(Maybe.getOrElse('none', just)).toBe('foo')
    })

    it('with null', () => {
      const nothing = Maybe.of(null)
      expect(Maybe.getOrElse('none', nothing)).toBe('none')
      const nothing2 = Maybe.of(undefined)
      expect(Maybe.getOrElse('none', nothing2)).toBe('none')
    })
  })

  describe('join', () => {
    it('with value', () => {
      const just = Maybe.of('foo')
      const nestedJust = Maybe.of(just)
      const resultJust = Maybe.join(nestedJust)
      expect(nestedJust.toString()).toBe('Just(Just(foo))')
      expect(resultJust.toString()).toBe('Just(foo)')
      expect(Maybe.join(resultJust).toString()).toBe('Nothing()')
    })

    it('with null', () => {
      const nestedNothing = Maybe.of(Maybe.of<string>(null))
      const resultNothing = Maybe.join(nestedNothing)
      expect(nestedNothing.toString()).toBe('Just(Nothing())')
      expect(resultNothing.toString()).toBe('Nothing()')
      expect(Maybe.join(resultNothing).toString()).toBe('Nothing()')
    })
  })

  describe('caseOf', () => {
    const caseOfMather: Maybe.CaseOf<number, number> = {
      Just: (x) => x + 5,
      Nothing: () => 0,
    }

    it('with value', () => {
      const just = Maybe.of(5).map(double)
      expect(Maybe.caseOf(caseOfMather, just)).toBe(15)
      expect(Maybe.caseOf(caseOfMather, just.map(double))).toBe(25)
    })

    it('with null', () => {
      const justToNothing = Maybe.of(5)
        .map(double)
        .map(double)
        .map(toNothing)
        .map(double)
      const nothing = Maybe.of<number>(null)
      expect(Maybe.caseOf(caseOfMather, justToNothing)).toBe(0)
      expect(Maybe.caseOf(caseOfMather, nothing)).toBe(0)
    })

    it('carry', () => {
      const just = Maybe.of(5).map(double)
      expect(Maybe.caseOf(caseOfMather)(just)).toBe(15)
      expect(typeof Maybe.caseOf(caseOfMather)).toBe('function')
    })
  })

  describe('equals', () => {
    it('with value and null', () => {
      const just = Maybe.of('foo')
      const sameJust = Maybe.of('foo')
      const notSameJust = Maybe.of('bar')
      const nothing = Maybe.of<string>(null)
      expect(Maybe.equals(just, sameJust)).toBeTruthy()
      expect(Maybe.equals(just, notSameJust)).toBeFalsy()
      expect(Maybe.equals(just, nothing)).toBeFalsy()
      expect(Maybe.equals(Maybe.of<string>(null), nothing)).toBeTruthy()
      expect(Maybe.equals(Maybe.of<string>(null), just)).toBeFalsy()
    })

    it('carried', () => {
      const just = Maybe.of('foo')
      const sameJust = Maybe.of('foo')
      const notSameJust = Maybe.of('bar')
      expect(Maybe.equals(just)(sameJust)).toBeTruthy()
      expect(Maybe.equals(just)(notSameJust)).toBeFalsy()
    })
  })

  describe('equalsValue', () => {
    it('with value and null', () => {
      const value = 'foo'
      const just = Maybe.of('foo')
      const nothing = Maybe.of<string>(null)
      expect(Maybe.equalsValue(value, just)).toBeTruthy()
      expect(Maybe.equalsValue('bar', just)).toBeFalsy()
      expect(Maybe.equalsValue(undefined, nothing)).toBeTruthy()
      expect(Maybe.equalsValue('foo', Maybe.of<string>(null))).toBeFalsy()
    })

    it('carried', () => {
      const value = 'foo'
      const just = Maybe.of('foo')
      expect(Maybe.equalsValue(value)(just)).toBeTruthy()
      expect(Maybe.equalsValue('bar')(just)).toBeFalsy()
    })
  })

  describe('toEither', () => {
    it('with value and null', () => {
      const foo = Maybe.of(12)
      const resultFoo = Maybe.map((x) => x * x, foo) // Just(144)
      const eitherFoo = Maybe.toEither('Some Error', resultFoo) // Either.Right(144)
      const resultBar = Maybe.map((x) => x * x, foo).filter((x) => x < 100) // Nothing()
      const eitherBar = Maybe.toEither('X greater than 100', resultBar) // Either.Left(X greater than 100)
      expect(resultFoo.toString()).toBe('Just(144)')
      expect(eitherFoo.toString()).toBe('Right(144)')
      expect(resultBar.toString()).toBe('Nothing()')
      expect(eitherBar.toString()).toBe('Left(X greater than 100)')
    })

    it('carried', () => {
      const foo = Maybe.of(12)
      const mapFoo = Maybe.map((x: number) => x * x) // Just(144)
      const toEitherFoo = Maybe.toEither('Some Error')
      const eitherFoo = toEitherFoo(mapFoo(foo)) // Either.Right(144)
      expect(eitherFoo.toString()).toBe('Right(144)')
    })
  })

  describe('lift', () => {
    const find = <T>(predicate: (v: T) => boolean) => (list: T[]): T | void => {
      const fn = ([item, ...list]: T[]): T | void => {
        if (predicate(item) === true) {
          return item
        }
        if (list.length === 0) {
          return undefined
        }
        return fn(list)
      }
      return fn(list)
    }
    type DataItem = {
      id: number
      name: string
    }
    const data: DataItem[] = [
      { id: 1, name: 'Jayson' },
      { id: 2, name: 'Michael' },
    ]
    const predicateValue = ({ id }: DataItem) => id === 1
    const predicateNull = ({ id }: DataItem) => id === 10

    it('find (helper)', () => {
      const finded = find(predicateValue)(data)
      const notBeFound = find(predicateNull)(data)
      expect(finded).toEqual(data[0])
      expect(notBeFound).toBeUndefined()
    })

    it('with value and null to find', () => {
      const finded = Maybe.lift(find(predicateValue), data)
      const notFound = Maybe.lift(find(predicateNull), data)
      expect(finded.toString()).toBe('Just([object Object])')
      expect(notFound.toString()).toBe('Nothing()')
    })

    it('with value and null to find carried', () => {
      const safeFind = Maybe.lift(find(predicateValue))
      const safeFindNothing = Maybe.lift(find(predicateNull))
      expect(safeFind(data).toString()).toBe('Just([object Object])')
      expect(safeFindNothing(data).toString()).toBe('Nothing()')
    })

    it('case from docs', () => {
      const find = <T>(list: T[]) => (predicate: (v: T) => boolean) =>
        list.find(predicate)

      type DataItem = {
        id: number
        name: string
      }

      const data: DataItem[] = [
        { id: 1, name: 'Jayson' },
        { id: 2, name: 'Michael' },
      ]
      const safeFindInList = Maybe.lift(find(data))

      const resultJust = safeFindInList(({ id }) => id === 1) // Just([object Object])
      const resultNothing = safeFindInList(({ id }) => id === 10) // Nothing()

      const matcher: Maybe.CaseOf<DataItem, string> = {
        Just: ({ name }) => name,
        Nothing: () => 'UNKNOWN',
      }

      expect(resultJust.caseOf(matcher)).toBe('Jayson')
      expect(resultNothing.caseOf(matcher)).toBe('UNKNOWN')
    })
  })

  describe('nothing', () => {
    it('just call the function', () => {
      expect(Maybe.nothing().toString()).toBe('Nothing()')
    })
  })
})

describe('Just and Nothing', () => {
  it('map', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.map(double).toString()).toBe('Just(10)')
    expect(just.map(double).map(double).toString()).toBe('Just(20)')
    expect(just.map(double).map(double).map(toNothing).toString()).toBe(
      'Nothing()',
    )
    expect(
      just.map(double).map(double).map(toNothing).map(double).toString(),
    ).toBe('Nothing()')
    expect(
      just.map(double).map(double).map(toNull).map(double).toString(),
    ).toBe('Nothing()')
  })

  it('chain', () => {
    const just = Maybe.of(5)
    const justString = Maybe.of('test')
    const result = just.chain(() => justString)
    result.map((x) => expect(x).toBe('test'))
    expect(just.toString()).toBe('Just(5)')
    expect(just.chain(doubleChain).getOrElse(undefined)).toBe(10)
    expect(just.map(double).chain(doubleChain).getOrElse(undefined)).toBe(20)
    expect(
      just.map(double).map(double).map(toNull).chain(doubleChain).isNothing(),
    ).toBeTruthy()
  })

  it('getOrElse', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.map(double).getOrElse('No value')).toBe(10)
    expect(just.map(double).map(toNull).getOrElse('No value')).toBe('No value')
    expect(just.map(double).map(toNothing).getOrElse(null)).toBe(null)
  })

  it('filter', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.filter((x) => x > 5).getOrElse('Not bigger 5')).toBe(
      'Not bigger 5',
    )
    expect(just.filter((x) => x === 5).getOrElse('Not 5')).toBe(5)
    expect(
      just
        .map(double)
        .filter((x) => x === 5)
        .getOrElse('Not 5'),
    ).toBe('Not 5')
    expect(
      just
        .map(double)
        .filter((x) => x > 5)
        .getOrElse('Not bigger 5'),
    ).toBe(10)
    expect(
      just
        .map(double)
        .map(toNothing)
        .filter((x) => x > 5)
        .getOrElse('Not bigger 5'),
    ).toBe('Not bigger 5')
    expect(
      just
        .map(double)
        .map(toNull)
        .filter((x) => x > 5)
        .getOrElse('Not bigger 5'),
    ).toBe('Not bigger 5')
  })

  it('toString', () => {
    const just = Maybe.of(5)
    const nothing = Maybe.of(null)
    expect(just.toString()).toBe('Just(5)')
    expect(nothing.toString()).toBe('Nothing()')
  })

  it('apply', () => {
    const just = Maybe.of(5)
    const maybeDouble = Maybe.of(double)
    const nothing = Maybe.of(null)
    expect(
      just
        .apply(maybeDouble)
        .map((x) => x + 15)
        .toString(),
    ).toBe('Just(25)')
    expect(
      just
        .apply(nothing)
        .map((x) => x + 15)
        .toString(),
    ).toBe('Nothing()')
    expect(nothing.apply(maybeDouble).toString()).toBe('Nothing()')
  })

  it('caseOf', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    const caseOfMather: Maybe.CaseOf<number, number> = {
      Just: (x) => x + 5,
      Nothing: () => 0,
    }
    expect(just.map(double).caseOf(caseOfMather)).toBe(15)
    expect(
      just
        .map(double)
        .map(double)
        .map(toNothing)
        .map(double)
        .caseOf(caseOfMather),
    ).toBe(0)
  })

  it('join', () => {
    const just = Maybe.of(5)
    const nestedJust = Maybe.of(just)
    const joinedJust = Maybe.of(Maybe.of(nestedJust)).join().join().join()
    const nothing = Maybe.of<number>(null)
    const nestedNothing = Maybe.of(nothing)
    expect(just.toString()).toBe('Just(5)')
    expect(joinedJust.toString()).toBe('Just(5)')
    expect(nestedJust.toString()).toBe('Just(Just(5))')
    expect(nestedJust.join().toString()).toBe('Just(5)')
    expect(just.join().toString()).toBe('Nothing()')
    expect(nothing.join().toString()).toBe('Nothing()')
    expect(nestedNothing.join().toString()).toBe('Nothing()')
  })

  it('equals', () => {
    const just = Maybe.of(5)
    const sameJust = Maybe.of(5)
    const notSameJust = Maybe.of(15)
    const nothing = Maybe.of<number>(null)
    expect(just.toString()).toBe('Just(5)')
    expect(sameJust.toString()).toBe('Just(5)')
    expect(just.equals(sameJust)).toBeTruthy()
    expect(just.equals(nothing)).toBeFalsy()
    expect(just.equals(notSameJust)).toBeFalsy()
    expect(just.map(double).equals(sameJust)).toBeFalsy()
    expect(just.map(toNothing).equals(sameJust)).toBeFalsy()
    expect(just.map(toNothing).equals(nothing)).toBeTruthy()
  })

  it('equalsValue', () => {
    const value = 5
    const just = Maybe.of(5)
    const nothing = Maybe.of<number>(null)
    expect(just.toString()).toBe('Just(5)')
    expect(just.equalsValue(value)).toBeTruthy()
    expect(just.equalsValue(10)).toBeFalsy()
    expect(nothing.equalsValue(5)).toBeFalsy()
    expect(nothing.equalsValue(null)).toBeTruthy()
  })

  it('toEither', () => {
    const just = Maybe.of(10)
    const nothing = Maybe.of<number>(null)

    expect(just.toEither('error').toString()).toBe('Right(10)')
    expect(nothing.toEither('error').toString()).toBe('Left(error)')
  })

  describe('Just', () => {
    it('isNothing', () => {
      const just = Maybe.of(5)
      expect(just.isNothing()).toBe(false)
    })
    it('isJust', () => {
      const just = Maybe.of(5)
      expect(just.isJust()).toBe(true)
    })
  })

  describe('Nothing', () => {
    it('isNothing', () => {
      const nothing = Maybe.of(null)
      expect(nothing.isNothing()).toBe(true)
    })
    it('isJust', () => {
      const nothing = Maybe.of(null)
      expect(nothing.isJust()).toBe(false)
    })
  })
})

describe('Other cases', () => {
  describe('NestedOptional', () => {
    type NestedOptional = {
      a: {
        b?: {
          c?: string
        }
      }
    }
    const maybeObject = Maybe.of<NestedOptional>({ a: {} })
    const maybeObjectFull = Maybe.of<NestedOptional>({
      a: { b: { c: 'monad-maniac' } },
    })

    it('getting exists field', () => {
      expect(maybeObject.map((obj) => obj.a).toString()).toBe(
        'Just([object Object])',
      )
    })
    it('getting not exists field and try concat string from value last field', () => {
      expect(
        maybeObject
          .map((obj) => obj.a)
          .map((obj) => obj.b)
          .map((obj) => obj.c)
          .map((str) => `this is ${str}`)
          .toString(),
      ).toBe('Nothing()')
    })

    it('getting exists field and try concat string from value last field', () => {
      expect(
        maybeObjectFull
          .map((obj) => obj.a)
          .map((obj) => obj.b)
          .map((obj) => obj.c)
          .map((str) => `this is ${str}`)
          .toString(),
      ).toBe('Just(this is monad-maniac)')
    })

    it('getting exists field and try concat string from value last field after filter with false', () => {
      expect(
        maybeObjectFull
          .map((obj) => obj.a)
          .map((obj) => obj.b)
          .map((obj) => obj.c)
          .filter((str) => str.length < 3)
          .map((str) => `this is ${str}`)
          .toString(),
      ).toBe('Nothing()')
    })
  })
})
