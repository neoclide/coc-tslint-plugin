# coc-tslint-plugin

**WARNING** this extension is deprecated since tslint is deprecated in favor of
eslint.

Adds [tslint](https://github.com/palantir/tslint) to coc.nvim using the [TypeScript TSLint language service plugin](https://github.com/Microsoft/typescript-tslint-plugin).

This is a fork of [vscode-typescript-tslint-plugin](https://github.com/Microsoft/vscode-typescript-tslint-plugin).

Please refer to the [tslint documentation](https://github.com/palantir/tslint) for how to configure the linting rules.

## Install

❗ **Important**: If you also have the [coc-tslint][coc-tslint] extension installed, please disable it to avoid linting files twice.\*

In your vim/neovim, run command:

```
:CocInstall coc-tsserver coc-tslint-plugin
```

## Configuration

You can either configure the TSLint extension using a `tsconfig` or `jsconfig` as described [here][configuration], or configure it with coc.nvim settings.

Note the coc.nvim based configuration override the `tsconfig` or `jsconfig` configuration.

- `tslint.configFile` - The configuration file that tslint should use instead of the default tslint.json. A relative file path is resolved relative to the project root.

- `tslint.jsEnable` - Enable/disable tslint for `.js` files. Default is `false`.

- `tslint.ignoreDefinitionFiles` - Control if TypeScript definition files should be ignored. Default is `true`.

- `tslint.exclude` - A glob or an array of globs. Any file matching these globs will not be linted.

- `tslint.alwaysShowRuleFailuresAsWarnings` - Always show rule failures as warnings, ignoring the severity configuration in the tslint.json configuration.

- `tslint.suppressWhileTypeErrorsPresent` - Suppress tslint errors from being reported while other errors are present.

- `tslint.autoFixOnSave` - fix autofixable issues on save.

## Differences with the [coc-tslint][coc-tslint] extension

- The implementation as a TypeScript server plugin enables to shares the program representation with TypeScript. This is more efficient than the current `coc-tslint` implementation. The current TSLint implementation needs to reanalyze a document that has already been analyzed by the TypeScript language server.

- `coc-tslint` can only lint one file a time. It therefore cannot support [semantic tslint rules](https://palantir.github.io/tslint/usage/type-checking/) that require the type checker. The language service plugin doesn't have this limitation. To overcome this limitation is a key motivation for reimplementing the extension.

## License

MIT

[coc-tslint]: https://github.com/neoclide/coc-tslint
[configuration]: https://github.com/Microsoft/typescript-tslint-plugin#configuration-options
