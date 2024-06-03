/*
|--------------------------------------------------------------------------
| Browser-sync config file
|--------------------------------------------------------------------------
|
| For up-to-date information about the options:
|   http://www.browsersync.io/docs/options/
|
| There are more options than you see here, these are just the ones that are
| set internally. See the website for more info.
|
|
*/
module.exports = {
  port: 3110,
  proxy: 'local.drupal10.test',
  open: false,
  browser: 'google chrome',
  ghostMode: false,
  notify: true,
  ui: false,
  files: [
    './css/style.css',
    './css/toolbar.css',
    './js/min/script.js'
  ],
  snippetOptions: {
    // Load Browsersync inject code before the closing body tag
    // in-order to avoid issues with D10's admin toolbar.
    rule: {
      match: /<\/body>/i,
      fn: function (snippet, match) {
        return snippet + match
      }
    }
  }
}
