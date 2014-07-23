var assert = require('chai').assert
var Dialog = require('../')
var domify = require('domify')
var bean = require('bean')

describe('Dialog', function(){
  before(function(){
    new Dialog({title: 'This is a title'}).show()
  })
  it('shows a dialog box with the proper data', function(){
    assert.equal(document.querySelector('.dialog h2').textContent, 'This is a title')
  })
})
