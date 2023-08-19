## Install

Install the following node modules (npm), in the same directory as this readme file, for compiling and linting our code.

```bash
yarn add autoprefixer browser-sync postcss sass sass-migrator standard stylelint stylelint-config-sass-guidelines stylelint-order uglify-js util yarn-upgrade-all --dev
```

To run sass-migrator on a file, run the following command `yarn sass-migrator module --verbose src/sass/DIR/FILE.scss`

---

## Linting

We'll also be linting our Sass and Javascript in order to produce well written and consistent code.

Required lint files (should be added during initial theme setup):

- .eslintrc.json
- .stylelint.json
- .stylelintignore

To do a global lint on the SCSS files run: `npx stylelint "scss/**/*.scss"`. To fix found errors add the `--fix` flag.

---

## Editor

**Sublime:** install the following packages using package control:

- SublimeLinter
- SublimeLinter-contrib-standard
- SublimeLinter-eslint
- SublimeLinter-stylelint

**VS Code:** install the following extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

Workspace setting should be located at the root of this project's repo: `/.vscode/settings.json`

```json
{
  "files.trimTrailingWhitespace": true,
  "eslint.workingDirectories": [
    "claroalter_base"
  ],
  "stylelint.packageManager": "yarn",
  "stylelint.configBasedir": "claroalter_base",
  "stylelint.configFile": "claroalter_base/.stylelintrc.json",
  "stylelint.snippet": [
    "sass",
    "scss"
  ],
  "stylelint.validate": [
    "sass",
    "scss"
  ],
  "phpsab.fixerEnable": true,
  "phpsab.snifferEnable": true,
  "phpsab.standard": "Drupal",
  "phpsab.executablePathCS": "./vendor/bin/phpcs",
  "phpsab.executablePathCBF": "./vendor/bin/phpcbf"
}
```
