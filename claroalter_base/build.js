const fs = require('fs')
const util = require('util')
const autoprefixer = require('autoprefixer')
const browserSync = require('browser-sync').create()
const postcss = require('postcss')
const sass = require('sass')
const uglifyjs = require('uglify-js')
// const localenv = require('./build.env')

const writeFile = util.promisify(fs.writeFile)

function bsync () {
  browserSync.init({
    port: 3110,
    proxy: 'local.drupal10.test',
    open: false,
    browser: 'google chrome',
    ui: false,
    ghostMode: false,
    notify: true,
    reloadOnRestart: true,
    files: ['css/style.css', 'css/toolbar.css', 'js/min/script.js'],
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
  })
}

// paths
const path = {
  styles: {
    src: './src/sass/style.scss',
    dest: './css/style.css',
    watch: './src/sass/*.scss'
  },
  toolbar: {
    src: './src/sass/toolbar.scss',
    dest: './css/toolbar.css'
  },
  scripts: {
    src: './src/js/script.js',
    dest: './js/script.js',
    watch: './src/js/*.js'
  }
}

// ----------------------------------------------------------------------------

// Function to compile Sass to CSS
function compileSass () {
  const result = sass.compile(path.styles.src, {
    style: 'expanded',
    sourceMap: true,
    sourceMapIncludeSources: true
  })

  return result
}

// Function to add vendor prefixes to CSS using PostCSS Autoprefixer
async function processCSS (css) {
  const result = await postcss([autoprefixer]).process(css, {
    from: path.styles.dest,
    to: path.styles.dest,
    map: {
      inline: false, // Generate external sourcemap file
      sourcesContent: true
    }
  })

  return result
}

// Main function to compile Sass, add vendor prefixes
async function buildCSS () {
  try {
    // Compile Sass to CSS
    const sassResult = compileSass()
    // create embeded sass sourcemap.
    const sassMap = JSON.stringify(sassResult.sourceMap)
    // convert soucres to relative paths.
    const mapSources = JSON.parse(sassMap)
    const updatedSources = mapSources.sources.map(source => {
      const segments = source.split('/')
      const baseIndex = segments.indexOf('src')

      if (baseIndex !== -1) {
        const remainingSegments = segments.slice(baseIndex)
        return remainingSegments.join('/')
      } else {
        return source
      }
    })
    mapSources.sources = updatedSources
    const updatedSassMap = JSON.stringify(mapSources)
    // complete embeded sass sourcemap after resource paths replacement.
    const sassMapBase64 = (Buffer.from(updatedSassMap, 'utf8') || '').toString('base64')
    const sassMapComment = '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' + sassMapBase64 + ' */'
    const finalResult = sassResult.css.toString() + '\n'.repeat(2) + sassMapComment

    // Add vendor prefixes to the CSS using PostCSS Autoprefixer
    const processedCss = await processCSS(finalResult)

    // Write the processed CSS and sourcemap to files
    await writeFile(path.styles.dest, processedCss.css)
    await writeFile(path.styles.dest + '.map', processedCss.map.toString())

    console.log('Sass build complete!')
  } catch (error) {
    console.error('Sass build error:', error)
  }
}

// ----------------------------------------------------------------------------

// Function to compile Toolbar Sass to CSS
function compileToolbarSass () {
  const result = sass.compile(path.toolbar.src, {
    style: 'expanded',
    sourceMap: true,
    sourceMapIncludeSources: true
  })

  return result
}

// Function to add vendor prefixes to CSS using PostCSS Autoprefixer
async function processToolbarCSS (css) {
  const result = await postcss([autoprefixer]).process(css, {
    from: path.toolbar.dest,
    to: path.toolbar.dest,
    map: {
      inline: false, // Generate external sourcemap file
      sourcesContent: true
    }
  })

  return result
}

// Main function to compile Sass, add vendor prefixes
async function buildToolbarCSS () {
  try {
    // Compile Sass to CSS
    const sassResult = compileToolbarSass()
    // create embeded sass sourcemap.
    const sassMap = JSON.stringify(sassResult.sourceMap)
    // convert soucres to relative paths.
    const mapSources = JSON.parse(sassMap)
    const updatedSources = mapSources.sources.map(source => {
      const segments = source.split('/')
      const baseIndex = segments.indexOf('src')

      if (baseIndex !== -1) {
        const remainingSegments = segments.slice(baseIndex)
        return remainingSegments.join('/')
      } else {
        return source
      }
    })
    mapSources.sources = updatedSources
    const updatedSassMap = JSON.stringify(mapSources)
    // complete embeded sass sourcemap after resource paths replacement.
    const sassMapBase64 = (Buffer.from(updatedSassMap, 'utf8') || '').toString('base64')
    const sassMapComment = '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' + sassMapBase64 + ' */'
    const finalResult = sassResult.css.toString() + '\n'.repeat(2) + sassMapComment

    // Add vendor prefixes to the CSS using PostCSS Autoprefixer
    const processedCss = await processToolbarCSS(finalResult)

    // Write the processed CSS and sourcemap to files
    await writeFile(path.toolbar.dest, processedCss.css)
    await writeFile(path.toolbar.dest + '.map', processedCss.map.toString())

    console.log('Toolbar Sass build complete!')
  } catch (error) {
    console.error('Toolbar Sass build error:', error)
  }
}

// ----------------------------------------------------------------------------

// Function to compress JavaScript
function compressJS () {
  const jsCode = fs.readFileSync(path.scripts.src, 'utf8')
  const options = {
    compress: true,
    mangle: false,
    sourceMap: {
      filename: path.scripts.dest,
      root: path.scripts.src,
      url: path.scripts.dest + '.map'
    }
  }
  const result = uglifyjs.minify(jsCode, options)
  return {
    code: result.code,
    map: result.map
  }
}

function minifyJS () {
  try {
    // Compress JavaScript using UglifyJS
    const jsResult = compressJS()

    // Write the compressed JavaScript and sourcemap to files
    writeFile(path.scripts.dest, jsResult.code)
    writeFile(path.scripts.dest + '.map', jsResult.map)

    console.log('UglifyJS complete!')
  } catch (error) {
    console.error('UglifyJS error:', error)
  }
}

// ----------------------------------------------------------------------------

// Run BrowserSync
function watchFiles () {
  bsync()

  browserSync.watch(path.styles.watch).on('change', function () {
    buildCSS()
    buildToolbarCSS()
  })

  browserSync.watch(path.scripts.watch).on('change', function () {
    minifyJS()
  })
}

module.exports = {
  buildCSS,
  buildToolbarCSS,
  minifyJS,
  watchFiles
}
