# IO

The monad need to _hide_ some side effect and keep your code clean.

You can use it for working with `WebSocket`, `fetch`, `console.log`, `DOM` and etc.
What could doing some side effect.

```ts
import { Either, IO } from 'monad-maniac'

type SideEffectDataType = { [id: number]: string }
let SideEffectData: SideEffectDataType = {
  1: 'Jake',
  2: 'Bob',
  3: 'Alice',
}

const logError = (...args: any[]) => console.error('Got error:', ...args)

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

// Will get `Jake`
// Changed string to `Jake was fired!`
// Write the string to SideEffectData
// In result will be `Jake was fired!`
const result = IO
  .from(readName(1))
  .map((name) => name.map(addFired))
  .chain(writeName(1))

// Name not found
// Also will show error in console
const resultFailure = IO
  .from(readName(10))
  .map((name) => name.map(addFired))
  .chain(writeName(10))
```