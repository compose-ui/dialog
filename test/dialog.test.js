var assert = require('chai').assert
var dialog = require('../')
var event = require('compose-event')

describe('Dialog', function(){
  before(function(){
    event.ready.fire()
  })
  afterEach(function(){
    var d = document.querySelector('.dialog')
    if (d) document.body.removeChild(d)
    var link = document.querySelector('[data-dialog-title]')
    if (link) document.body.removeChild(link)
  })
  it('shows a dialog box with the proper data', function(){
    dialog.show({title: 'This is a title'})
    assert.equal( document.querySelector('.dialog-title').textContent, 'This is a title')
  })

  it('removes element when dialog closes', function(){
    dialog.show({title: 'This is a title'})
    event.fire( document.querySelector( '.dialog-cancel' ), 'click' )
    assert.isNull( document.querySelector( '.dialog' ) )
  })

  it('shows a dialog box with the proper data', function(){
    var d = document.querySelector('.dialog')
    if (d) document.body.removeChild(d)
    // Add link to trigger new dialog
    document.body.insertAdjacentHTML('beforeend', "<a class='link' href='#' data-dialog-title='Dialog title' data-dialog-cancel='go away'>link</a>")
    event.fire(document.querySelector('[data-dialog-title]'), 'click')

    assert.equal(document.querySelector('.dialog-title').textContent, 'Dialog title')
    assert.equal(document.querySelector('.dialog-cancel').textContent, 'go away')
  })
  it('doesn\'t show a dialog if `data-dialog-if` isn\'t fullfilled', function(){

    // Add link to trigger new dialog
    document.body.insertAdjacentHTML('beforeend', "<a class='link' href='#' data-dialog-if='.link-yeah' data-dialog-title='Dialog if not'>link</a>")
    event.fire(document.querySelector('[data-dialog-title]'), 'click')

    assert.isNull(document.querySelector('.dialog'))
  })
  it('does show a dialog if `data-dialog-if` is fullfilled', function(){

    // Add link to trigger new dialog
    document.body.insertAdjacentHTML('beforeend', "<a class='link-yeah' href='#' data-dialog-if='.link-yeah' data-dialog-title='Dialog title'>link</a>")
    event.fire(document.querySelector('[data-dialog-title]'), 'click')

    assert.isNotNull(document.querySelector('.dialog'))
  })
})
