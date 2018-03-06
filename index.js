var toolbox = require('compose-toolbox'),
    Event   = toolbox.event,
    options = {},
    wrap = document.createElement('div'),
    dialogEl,
    focusedEl,
    defaults = {
      onShow: function(){},
      onClose: function(){},
      buttonTemplate: '<button role="button" class="button"></button>',
      dialogTemplate: '<div role="dialog" class="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">\
  <div class="dialog-card">\
    <header class="dialog-header">\
      <h2 class="dialog-title" id="dialog-title"></h2>\
    </header>\
    <p class="dialog-description" id="dialog-description"></p>\
    <div class="dialog-response">\
      <div class="dialog-actions"></div>\
    </div>\
  </div>\
</div>'}

function show( opts ) {
  if ( typeof opts != 'object' ) { return console.error('Invalid options passed for Dialog', opts) }

  if ( !opts.title ) { return console.error('Dialog must have a title', opts) }

  focusedEl = document.activeElement
  options = opts
  dialogEl = template( defaults.dialogTemplate )

  addText()
  addButtons()

  document.body.insertAdjacentElement( 'afterbegin', dialogEl )

  listen()

  defaults.onShow()
}

function listen() {

  Event.on( dialogEl, 'click', '.dialog-continue', continueAction )
  Event.on( dialogEl, 'click', '.dialog-cancel', cancelAction )
  Event.afterAnimation( dialogEl, tab, true )

  Event.keyOn(  'tab',   'dialog', tab )
  Event.keyOne( 'enter', 'dialog', continueAction )
  Event.keyOne( 'esc',   'dialog', cancelAction )

  Event.key.setScope( 'dialog' )
}

// Add title and description from options
function addText() {

  // Add title
  dialogEl.querySelector( '#dialog-title' ).innerHTML = options.title

  // Add optional description
  var descriptionEl = dialogEl.querySelector( '#dialog-description' )

  if ( options.description ) {
    descriptionEl.innerHTML = options.description
  } else {
    descriptionEl.parentElement.removeChild( descriptionEl )
    dialogEl.removeAttribute( 'aria-labelledby' )
  }

}

// Add Cancel and Continue buttons (if necessary)
function addButtons() {

  if ( options.continue || options.follow || options.submit ) {

    var continueButton = template( defaults.buttonTemplate )
    continueButton.classList.add( 'dialog-continue' )
    if ( options.destructive ) { continueButton.classList.add( 'destructive' ) }
    continueButton.innerHTML = options.continue || 'Continue'

    dialogEl.querySelector('.dialog-actions').appendChild( continueButton )

    options.cancel = options.cancel || 'Cancel'
  }

  var cancelButton = template( defaults.buttonTemplate )

  cancelButton.classList.add( 'dialog-cancel' )
  cancelButton.innerHTML = options.cancel || ( options.continue ? 'Cancel' : 'OK' )

  dialogEl.querySelector('.dialog-actions').appendChild( cancelButton )

}

// In a modal window, `tab` must cycle between elements in the modal.
function tab( event ) {

  // Find all focusable elements in the dialog card
  var focusable   = dialogEl.querySelectorAll('input:not([type=hidden]), textarea, select, button'),
      last        = focusable[focusable.length - 1],
      focused     = document.activeElement

  // If focused on the last focusable element, tab to the first element.
  if ( focused == last ) {
    if ( event ){ event.preventDefault() }
    focusable[0].focus()
  }

  // Focus on the last element if the focused element is not a child of the dialog
  if ( !focused || !toolbox.childOf( focused, dialogEl ) ) {
    last.focus()
  }
}

function triggerButton( selector ) {
  var button = dialogEl.querySelector( selector )

  button.focus()
  button.classList.add( 'active' )
}

function cancelAction (event) {
  if (event){ event.preventDefault() }

  triggerButton( '.dialog-cancel' )

  close( options.onDismiss )
}

function continueAction ( event ) {
  if ( event ){ event.preventDefault() }

  triggerButton( '.dialog-continue' )

  close( function() {
    if ( options.submit ) {

      // Is it an element or a string
      var form = ( options.submit.nodeType ? options.submit : document.querySelector(options.submit) )

      Event.submit( form )

    } else if ( options.follow ) {
      if( options.follow.match(/^https?:\/\//) )
        window.location = options.follow
      else
        window.location.href = options.follow
    }

    if ( options.onConfirm ) options.onConfirm()
  })
}

function close( callback ){
  dialogEl.classList.add( 'dismiss' )

  Event.afterAnimation( dialogEl, function( event ) {
    if ( callback ) { callback() }
    remove()
  }, true)
}


function remove(){

  // Remove all event listeners
  Event.key.deleteScope( 'dialog' )
  Event.off( dialogEl, 'click' )

  // Remove the element
  document.body.removeChild( dialogEl )

  // Fire on close callback
  defaults.onClose()

  // Return focus to the focused element before the dialog was shown
  focusedEl.focus()
}

function template( html ) {
  wrap.innerHTML = html
  var el = wrap.firstChild
  wrap.removeChild( el )
  return el
}

// Get all options from data-dialog-*
function extractOptions( el ) {
  var opts = {
    if:           el.dataset.dialogIf,
    follow:       el.dataset.dialogFollow,
    title:        el.dataset.dialogTitle,
    description:  el.dataset.dialogDescription,
    submit:       el.dataset.dialogSubmit,
    continue:     el.dataset.dialogContinue,
    cancel:       el.dataset.dialogCancel,
    confirm:      el.dataset.dialogConfirm,
    destructive:  el.dataset.dialogDestructive
  }

  if ( opts.confirm ) {
    opts.continue = opts.continue || el.innerHTML
    opts.submit   = opts.submit   || toolbox.getClosest( el, 'form' )
  }

  return opts
}

Event.ready(function() {

  // Trigger is called when a DOM element with data-trigger=dialog is clicked
  // The data attributes are used as options for configuring a dialog
  //
  Event.on( document, 'click', '[data-dialog-title]', function(event){
    var opts = extractOptions( event.currentTarget )
    if ( !opts.if || document.querySelector(opts.if) ) {
      event.preventDefault()
      event.stopImmediatePropagation()
      show( opts )
    }
  })
})

module.exports = {
  show: show,
  cancel: cancelAction,
  continue: continueAction,
  defaults: defaults
}
