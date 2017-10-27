var assert = require('chai').assert
var dialog = require('../')
var event = require('compose-event')

describe('Dialog', function(){
  before(function(){
    event.ready.fire()
    dialog.show({title: 'This is a title'})
  })
  it('shows a dialog box with the proper data', function(){
    assert.equal( document.querySelector('.dialog-title').textContent, 'This is a title')
  })

  it('removes element when dialog closes', function(){
    event.fire( document.querySelector( '.dialog-cancel' ), 'click' )
    assert.isNull( document.querySelector( '.dialog' ) )
  })

  it('shows a dialog box with the proper data', function(){
    // clean up after previous attachment
    var d = document.querySelector('.dialog')
    if (d) document.body.removeChild(d)

    // Add link to trigger new dialog
    document.body.insertAdjacentHTML('beforeend', "<a class='link' href='#' data-dialog-title='Dialog title' data-dialog-cancel='go away'>link</a>")
    event.fire(document.querySelector('[data-dialog-title]'), 'click')

    assert.equal(document.querySelector('.dialog-title').textContent, 'Dialog title')
    assert.equal(document.querySelector('.dialog-cancel').textContent, 'go away')
  })
})
