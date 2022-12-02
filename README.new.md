# Vite npm package template

A template for an npm package using:

- vite
- typescript
- jest
- prettier & eslint
- controlled commits with commitizen, lint-staged, etc.
- & more!

Inspired by this post by [Onur Önder](https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/)

## Setup

1. Install packages.
1. Edit the top of the package.json file to include the correct package name and description. You can find and replace for "\<LIBRARY\>"
1. Edit the README.md

## Scripts

    - `lint` : lint the code. You can also do `fix` to auto-fix.
    - `test` : test with jest. Also `test:coverage` and `test:watch`
    - `build` : bundle the code
    - `cz` & `release` : see below

## Commits & Releases

Code is automatically linted before being committed. I recommend installing the plugins for eslint and prettier in your code editor. You can attempt to fix linting issues with `yarn fix`.

When ready to commit, please commit using `yarn cz` to use commitizen for standard format commits.

When ready to release use `yarn release` with the `-r patch|minor|major` flag (default without the flag is `patch`).

You'll then need to publish your changes separately.
