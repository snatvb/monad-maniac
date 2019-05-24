# :page_with_curl: Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] :bomb:

## :bulb: [0.3.0] - 2019-05-24

### :gift: Added
- `toEither` as pure function for `Maybe`
- `toEither` as method for `Maybe`
- `toMaybe` as pure function for `Either`
- `toMaybe` as method for `Either`
- `dark theme` for docs

### :surfer: Changed
- Fixed mistake in docs with link to interface `Maybe` or `Either` from pure function
- Fixed mistakes in docs for calling pure functions in `Maybe` examples

## :bulb: [0.2.0] - 2019-05-21

### :gift: Added
- `lift` as pure function for `Maybe`
- `Either` monad
- `Maybe` type for ts-doc annotation :tada:
- Alias for `Maybe` interface for use as type - `Shape`, this need using with context `Maybe.Shape<T>`

### :surfer: Changed
- Fixed mistake in naming `mather` to `matcher` :sweat_smile:
- Fixed type `ApplicativeResult` (it could not return the nullable, now this will be available)
- :fire: **WARNING** `MaybeShape` marked as **Deprecated**!
- :fire: `Maybe.chain` was fixed, now will returns `Nothing` if the method was called on `Nothing`!

## :bulb: [0.1.0] - 2019-05-19

### :gift: Added
- `join` as method and pure function.
- `chain` as method and pure function.
- `equals` as method and pure function.
- `caseOf` as method and pure function.
- `equalsValue` as method and pure function.
- Smoke test and really build to **Travis CI**.
- Labels of `npm`, `coverage`, `travis`.

[unreleased]: https://github.com/snatvb/monad-maniac/compare/v0.2.0...develop
[0.3.0]: https://github.com/snatvb/monad-maniac/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/snatvb/monad-maniac/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/snatvb/monad-maniac/compare/v0.0.1...v0.1.0