# JSON Lense

JSON Lense is the most elaborate open source JSON inspector tool. [#GithubPage](https://phryxia.github.io/json-lense/)

## Features

- Various JSON input method
  - By text
  - By clipboard
  - By file
- Optimized tree style JSON viewer
  - Can render huge JSON without lag, thanks to fake scroll technique
- Manipulate JSON using TypeScript
  - with inferenced type from your JSON data!

## Values of JSON Lense

- Developer friendly
- Open source
- No freaking ad
- 100% Client Logic
  - No server api
  - No data leakage
  - No user tracking
- Safe code evaluation using [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
  - No `eval` or `Function` based code execution

## Run on your local environment

Note that there is no difference with github page hosted one, in terms of features.

```
npm i

# simply dev mode will work
npm run dev 

# or you can build and serve
npm run build
npm run preview
```

## Development

Please read `CODE_OF_CONDUCT.md` first.

JSON Lense uses 

- [`npm`](https://www.npmjs.com/) for package manager
- [`vite`](https://github.com/vitejs/vite) for bundler
- [`vitest`](https://github.com/vitest-dev/vitest) for unit tester
- [`monaco-editor`](https://github.com/microsoft/monaco-editor) for editor

FYI checkout the `package.json`.

Also, **don't forget to enable** [`prettier`](https://prettier.io/) in your IDE or manually apply before you commit.
