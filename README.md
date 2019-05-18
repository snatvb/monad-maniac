# Monads

[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]

You finally made it. You stepped through the looking glass. You learned functional programming. You mastered currying and composition, and followed the path of functional purity. And gradually, you notice a change in the attitude of the other programmers. There’s ever-so-slightly less disdain in their voice when you talk to them. Every so often you’ll get a little nod when you happen to mention immutable data structures. You’ve begun to earn their respect. And yet…

There’s something they won’t talk about. When they think you’re not in earshot, every so often, you’ll overhear the word ‘monad’ discussed in hushed tones. But as soon as they notice you’re there, they change the subject. One day, you pluck up the courage to ask someone. “What’s this monad thing I keep hearing about?” The other programmer just looks at you. After an awkward silence she simply says “I can’t talk about it”. So you ask another programmer and she replies “Maybe when you’ve learned Haskell.” She walks away sadly, shaking her head.

Mystified, you start searching for answers on the Internet. And at first there seems to be plenty of people eager to explain the mysterious monads. But, there’s a problem. It’s as if every single one of them writes in some kind of code. They talk about applicative functors, category theory, algebraic structures and monadic laws. But none of them seem to explain what monads are for. What do they do? Why do they exist? You keep searching and discover article after article trying to come up with some kind of analogy. Monads are like tupperware. Monads are like trees. Monads are like a bucket line. Monads are like hazmat suits. Monads are like burritos. Comparing monads to burritos considered harmful… It starts to drive you mad.

One day, one of the more junior programmers approaches you, a furtive expression on his face. “Look, you’ve got to stop asking questions about monads, OK? It upsets people. Monads are cursed. It’s not that people don’t want to tell you about them. They can’t.” He looks around again and continues in a hushed tone. “Even ol' father Crockford couldn’t break the curse. He tried. In a keynote conference talk and everything. But it got him. He couldn’t do it. Either you figure monads out or you don’t. No one can help you. That’s just how it works.”

© [James Sinclair](https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/)

## Maybe
`Maybe` - this is monad for safe working with data. How ofter do you seen such error?
```js
Uncaught ReferenceError: foo is not defined
    at <anonymous>:1:1
```
`Maybe` can you help you, maybe not... :)

```js
const db = [
  { name: 'foo', id: 1 },
  { name: 'bar', id: 2 },
  { name: 'baz', id: 3 },
]
const user = db.find(({ id }) => id === 2)
// Fine
const greeting = `Hello ${user.name}!`

// ...

const user = db.find(({ id }) => id === 10)
/*
Uncaught TypeError: Cannot read property 'name' of undefined
    at <anonymous>:7:32
*/
const greeting = `Hello ${user.name}!`

// Right way

const user = db.find(({ id }) => id === 10)
// Fine
const greeting = user ? `Hello ${user.name}!` : 'No-one to greet... :('
```
Typescript can you help, if you forget to add check, you will notify about that. But if your data have a lot of nested optional fields, you will get the hell out of checks on `null` and `undefined`, maybe other types.

So, `Maybe` can you help you!
Look at this:
```ts
import { Maybe } from 'monad-maniac'

const db = [
  { name: 'foo', id: 1 },
  { name: 'bar', id: 2 },
  { name: 'baz', id: 3 },
]

const user = Maybe.of(db.find({ id }) => id === 2)
// greeting = "Hello, bar!"
const greeting = user
  .map(({ name }) => `Hello, ${name}!`)
  .getOrElse('No-one to greet... :(')

// ...

const user = Maybe.of(db.find({ id }) => id === 10)
// greeting = "No-one to greet... :("
const greeting = user
  .map(({ name }) => `Hello, ${name}!`)
  .getOrElse('No-one to greet... :(')
```

### How use it?

#### of
`of` - factory function for `Maybe`.
```ts
import { Maybe } from 'monad-maniac'

const maybeFoo = Maybe.of('foo') // Just(foo)
const maybeBar = Maybe.of(null) // Nothing()
const maybeBaz = Maybe.of(undefined) // Nothing()
```

#### map
`map` - this is method or pure function `Maybe`. When data maybe is `null` or `undefined`
and with the data need to do something, usually used a lot of checks. With `Maybe` you can forget about it.
```ts
import { Maybe } from 'monad-maniac'

type Data = {
  message?: {
    sender?: {
      name?: string
    }
  }
}

const maybeData = Maybe.of<Data>({
  message: {
    sender: {
      name: 'MR. Holmes',
    }
  }
})

const prop = <T, K extends keyof T>(key: K) => (obj: T) => obj[key]

const heyMister: string = maybeData
  .map(prop('message'))
  .map(prop('sender'))
  .map(prop('name'))
  .caseOf({
    Just: (name) => `Hey! ${name}!`,
    Nothing: () => 'Unknown sender'
  })

console.log(heyMister) // Hey! MR. Holmes!
```
```ts
import { Maybe } from 'monad-maniac'

type Data = {
  message?: {
    sender?: {
      name?: string
    }
  }
}

const maybeData = Maybe.of<Data>({})

const prop = <T, K extends keyof T>(key: K) => (obj: T) => obj[key]

const heyMister: string = maybeData
  .map(prop('message'))
  .map(prop('sender'))
  .map(prop('name'))
  .caseOf({
    Just: (name) => `Hey! ${name}!`,
    Nothing: () => 'Unknown sender'
  })

console.log(heyMister) // Unknown sender
```

#### caseOf && getOrElse
This functions serve one purpose - unwrapping `Maybe`.
```ts
import { Maybe } from 'monad-maniac'

const just = Maybe.of(10)
const nothing = Maybe.of<number>(null)

const square = (x: number): number => x * x

// getOrElse
const justResult: ?number = just.map(square).getOrElse(undefined) // 100
const justMoreResult: number = just.map(square).getOrElse(0) // 100
const nothingResult: number = nothing.map(square).getOrElse(0) // 0
const nothingMoreResult: ?number = nothing
  .map(square)
  .getOrElse(undefined) // undefined

// caseOf
const justUnwrapped: number = just.caseOf({
  Just: square,
  Nothing: Infinity,
}) // 100
const nothingUnwrapped: number = nothing.caseOf({
  Just: square,
  Nothing: Infinity,
}) // Infinity
```

#### join
If need to get `Maybe` from `Maybe` the function is irreplaceable.

```ts
import { Maybe } from 'monad-maniac'

const just = Maybe.of(10)
const maybeJust = just.map((x) => Maybe.of(x + 5)) // Just(Just(15))
const justFifteen = maybeJust.join() // Just(15)

// ...
maybeJust
  .join() // Just(15)
  .join() // Nothing()
  .join() // Nothing()
  .join() // Nothing()
  .join() // Nothing()
  .join() // Nothing()
```

#### chain
This function like `Maybe.map` but returns not `Maybe` but what will be result of callback function.

```ts
import { Maybe } from 'monad-maniac'

const just = Maybe.of(10)
const divided = just.chain((x) => x / 2) // 5
const none = just.chain((x) => x > 10000 ? x / 2 : undefined) // undefined
```

#### filter
Function `filter` takes predicate and returns `Just` if will be returned `true` and `Nothing` otherwise.

```ts
import { Maybe } from 'monad-maniac'

const just = Maybe.of(10)
const divided = just.map((x) => 20 / x) // Just(2) - ok

const dividedNaN = Maybe.of(0).map((x) => 20 / x) // Just(NaN)... :worried:

// With filter:

const dividedNormally = Maybe
  .of(0)
  .filter((x) => x !== 0)
  .map((x) => 20 / x) // Nothing() - great!
const dividedNormallyJust = Maybe
  .of(2)
  .filter((x) => x !== 0)
  .map((x) => 20 / x) // Just(10) - great!
```

[travis-image]: https://travis-ci.org/snatvb/monad-maniac.svg?style=flat-square&branch=master
[travis-url]: https://travis-ci.org/snatvb/monad-maniac
[npm-image]: https://img.shields.io/npm/v/monad-maniac.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/monad-maniac
[coveralls-image]: https://img.shields.io/coveralls/snatvb/monad-maniac.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/snatvb/monad-maniac