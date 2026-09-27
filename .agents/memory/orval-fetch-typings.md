---
name: Orval fetch typings
description: TypeScript compatibility needed by generated React API helpers.
---

Generated Orval client helpers may call `Headers.entries()`, so the client library compiler settings must include the `dom.iterable` library alongside `dom`.

**Why:** The generated fetch helper typechecks against `Headers`, whose iterable methods are not available from the plain DOM library.

**How to apply:** If API codegen introduces a `Headers.entries()` type error, update the client library `lib` configuration before changing generated files.