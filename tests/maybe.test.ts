import { Maybe } from '../src'

const double = (x: number): number => x * 2
const concat = (a: string) => (b: string): string => `${b}${a}`
const toNothing = (): undefined | number => undefined
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
})

describe('Just and Nothing', () => {
  it('map', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.map(double).toString()).toBe('Just(10)')
    expect(just.map(double).map(double).toString()).toBe('Just(20)')
    expect(just.map(double).map(double).map(toNothing).toString()).toBe('Nothing()')
    expect(
      just
        .map(double)
        .map(double)
        .map(toNothing)
        .map(double)
        .toString()
    ).toBe('Nothing()')
    expect(
      just
        .map(double)
        .map(double)
        .map(toNull)
        .map(double)
        .toString()
    ).toBe('Nothing()')
  })
  it('map', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.chain(double)).toBe(10)
    expect(just.map(double).chain(double)).toBe(20)
    expect(just.map(double).map(double).chain(toNothing)).toBe(undefined)
    expect(
      just
        .map(double)
        .map(double)
        .map(toNothing)
        .chain(double)
    ).toBe(undefined)
    expect(
      just
        .map(double)
        .map(double)
        .map(toNull)
        .chain(double)
    ).toBe(undefined)
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
    expect(just.filter((x) => x > 5).getOrElse('Not bigger 5')).toBe('Not bigger 5')
    expect(just.filter((x) => x === 5).getOrElse('Not 5')).toBe(5)
    expect(just.map(double).filter((x) => x === 5).getOrElse('Not 5')).toBe('Not 5')
    expect(just.map(double).filter((x) => x > 5).getOrElse('Not bigger 5')).toBe(10)
    expect(just.map(double).map(toNothing).filter((x) => x > 5).getOrElse('Not bigger 5')).toBe('Not bigger 5')
    expect(just.map(double).map(toNull).filter((x) => x > 5).getOrElse('Not bigger 5')).toBe('Not bigger 5')
  })

  it('toString', () => {
    const just = Maybe.of(5)
    const nothing = Maybe.of(null)
    expect(just.toString()).toBe('Just(5)')
    expect(nothing.toString()).toBe('Nothing()')
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
