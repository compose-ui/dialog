var assert = require('chai').assert
var Dialog = require('dialog')
var domify = require('domify')
var bean = require('bean')

describe('Dialog', function(){
  describe('automatic instantiation', function(){
    before(function(){
      var a = domify('<a href="#" data-trigger="dialog"></a>')
      a.setAttribute('data-title', 'This is a title')
      document.body.appendChild(a)
      bean.fire(a, 'click')
    })
    it('shows a dialog box with the proper data', function(){
      assert.equal(document.querySelector('.dialog h2').textContent, 'This is a title')
    })
  })
})