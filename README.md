# Monads
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

`of` - factory function for `Maybe`.
```ts
import { Maybe } from 'monad-maniac'

const maybeFoo = Maybe.of('foo') // Just(foo)
const maybeBar = Maybe.of(null) // Nothing()
const maybeBaz = Maybe.of(undefined) // Nothing()
```

To be continue...
