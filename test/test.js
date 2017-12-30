const expect = require("chai").expect
const assert = require("chai").assert
const path = require('path')
const sassTrue = require('sass-true')

const sassFile = path.join(__dirname, 'test.scss')
describe('SCSS', function () {
  sassTrue.runSass({ file: sassFile }, describe, it)
})