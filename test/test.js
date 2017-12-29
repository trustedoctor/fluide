const expect = require("chai").expect
const path = require('path')
const sassTrue = require('sass-true')

var sassFile = path.join(__dirname, 'test.scss')

describe('SCSS', function () {
  sassTrue.runSass({ file: sassFile }, describe, it)
})