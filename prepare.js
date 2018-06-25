const fs = require('fs')
const gzipSize = require('gzip-size')

// const stats = fs.statSync("../library/dist/fluide.min.css")
// const size = Math.round((stats.size / 1024) * 100) / 100
// console.log(size)

console.info("Checking size of css file")
const fileCSS = fs.readFileSync('../library/dist/fluide.min.css', "utf8")
const sizeBytesCSS = gzipSize.sync(fileCSS)
const sizeCSS = Math.round((sizeBytesCSS / 1024) * 100) / 100

const fileJS = fs.readFileSync('../library/dist/fluide.min.js', "utf8")
const sizeBytesJS = gzipSize.sync(fileJS)
const sizeJS = Math.round((sizeBytesJS / 1024) * 100) / 100

const size = sizeCSS + sizeJS

console.info("Writing size of files to templates (CSS: " + sizeCSS + ", JS: " + sizeJS + ")")
const indexFile = fs.readFileSync('./themes/fluide/layout/index.ejs', "utf8")
const data = indexFile.replace(/<span class="replace-size">([^<]*)<\/span>/g, '<span class="replace-size">' + size + 'kb (gzip)</span>')
fs.writeFileSync('./themes/fluide/layout/index.ejs', data)