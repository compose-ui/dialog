var assert = require('chai').assert
var dialog = require('../')
var event = require('compose-event')

describe('Dialog', function(){
  before(function(){
    event.fire(document, 'DOMContentLoaded')
    dialog.show({title: 'This is a title'})
  })
  it('shows a dialog box with the proper data', function(){
    assert.equal(document.querySelector('.dialog h2').textContent, 'This is a title')
  })

  it('removes element when dialog closes', function(){
    event.fire(document.querySelector('.dialog-close'), 'click')
    assert.isNotNull(document.querySelector('.dialog.dismiss'))
  })

  it('shows a dialog box with the proper data', function(){
    // clean up after previous attachment
    var d = document.querySelector('.dialog')
    if (d) document.body.removeChild(d)

    // Add link to trigger new dialog
    document.body.insertAdjacentHTML('beforeend', "<a class='link' href='#' data-trigger='dialog' data-title='Dialog title' data-close='go away'>link</a>")
    event.fire(document.querySelector('[data-trigger=dialog]'), 'click')

    assert.equal(document.querySelector('.dialog h2').textContent, 'Dialog title')
    assert.equal(document.querySelector('.dialog-close').textContent, 'go away')
  })
})
