import { Maybe } from '../src'

const double = (x: number): number => x * 2
const toNothing = (): undefined | number => undefined

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
})

describe('Just', () => {
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
  })

  it('getOrElse', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.map(double).getOrElse('No value')).toBe(10)
    expect(just.map(double).map(toNothing).getOrElse('No value')).toBe('No value')
    expect(just.map(double).map(toNothing).getOrElse(null)).toBe(null)
  })

  it('getOrElse', () => {
    const just = Maybe.of(5)
    expect(just.toString()).toBe('Just(5)')
    expect(just.map(double).getOrElse('No value')).toBe(10)
    expect(just.map(double).map(toNothing).getOrElse('No value')).toBe('No value')
    expect(just.map(double).map(toNothing).getOrElse(null)).toBe(null)
  })
})
