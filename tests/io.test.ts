import { Either, IO } from '../src'

describe('Pure functions', () => {
  it('of', () => {
    expect(IO.of(222).run()).toBe(222)
    expect(IO.of(4).map((x) => x * x).run()).toBe(16)
  })

  it('from', () => {
    expect(IO.from(() => 222).run()).toBe(222)
    expect(IO.from(() => 4).map((x) => x * x).run()).toBe(16)
  })
})

describe('Docs', () => {
  it('map and chain', () => {
    type SideEffectDataType = { [id: number]: string }
    let SideEffectData: SideEffectDataType = {
     1: 'Jake',
     2: 'Bob',
     3: 'Alice',
    }

    const logError = (...args: any[]) => args

    const readName = (id: number) => (): Either.Shape<string, string> => {
     const name = SideEffectData[id]
     return name
       ? Either.right(name)
       : Either.left('Name not found')
    }

    const writeName = (id: number) => (name: Either.Shape<string, string>) => {
     return name.caseOf({
       Left: (error) => {
        logError(error)
        return error
       },
       Right: (name) => SideEffectData[id] = name,
     })
    }

    const addFired = (name: string) => `${name} was fired!`

    const result = IO
      .from(readName(1))
      .map((name) => name.map(addFired))
      .chain(writeName(1))

    const resultFailure = IO
      .from(readName(10))
      .map((name) => name.map(addFired))
      .chain(writeName(10))

    expect(result).toBe('Jake was fired!')
    expect(resultFailure).toBe('Name not found')
    expect(SideEffectData).toEqual({
      1: 'Jake was fired!',
      2: 'Bob',
      3: 'Alice',
     })
  })
})

describe('Pure functions', () => {
  type SideEffectDataType = { [id: number]: string }
  let SideEffectData: SideEffectDataType = {
   1: 'Jake',
   2: 'Bob',
   3: 'Alice',
  }

  const logError = (...args: any[]) => args

  const readName = (id: number) => (): Either.Shape<string, string> => {
   const name = SideEffectData[id]
   return name
     ? Either.right(name)
     : Either.left('Name not found')
  }

  const writeName = (id: number) => (name: Either.Shape<string, string>) => {
   return name.caseOf({
     Left: (error) => {
      logError(error)
      return error
     },
     Right: (name) => SideEffectData[id] = name,
   })
  }
  it('map and chain', () => {
    const addFired = (name: string) => `${name} was fired!`

    const readedIO = IO.from(readName(1))

    const resultAddedFired = IO.map((name) => name.map(addFired), readedIO)
    const result = IO.chain(writeName(1), resultAddedFired)

    expect(result).toBe('Jake was fired!')
    expect(SideEffectData).toEqual({
      1: 'Jake was fired!',
      2: 'Bob',
      3: 'Alice',
     })
  })
})
