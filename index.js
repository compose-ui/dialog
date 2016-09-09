var tpl = require('./templates/dialog')
var oneBtn = require('./templates/one-button')
var twoBtn = require('./templates/two-button')
var Event = require('compose-event')

var dialog = {
  show: function(options) {
    self.options = options
    self.render()
    self.listen()

    return this
  },

  render: function() {
    document.body.insertAdjacentHTML('beforeend', tpl)
    var el = document.body.lastChild
    document.body.removeChild(el)

    // Add continue button from two button template and set the 
    // style and label of the button based on options
    //
    if (self.options.continue) {
      el.querySelector('.dialog-actions').innerHTML = twoBtn
      self.continueButton = el.querySelector('.dialog-continue')

      self.continueButton.textContent = self.options.continue

      if (self.options.destructive) {
        self.continueButton.classList.remove('primary-btn')
        self.continueButton.classList.add('primary-destroy-btn')
      }
    } else {
      el.querySelector('.dialog-actions').innerHTML = oneBtn
    }

    self.closeButton = el.querySelector('.dialog-close')

    el.querySelector('.dialog-close').textContent = self.options.close || 'Cancel'


    var message = el.querySelector('.dialog-message')

    if (self.options.messageHTML) {
      message.innerHTML = self.options.messageHTML
    } else {
      if (self.options.title) {
        message.innerHTML += "<h2>" + self.options.title + "</h2>"
      }
      if (self.options.message) {
        message.innerHTML += "<p>" + self.options.message + "</p>"
      }
    }

    self.el = el
    document.body.appendChild(self.el)
  },

  listen: function() {
    Event.on(self.el, 'click', '.dialog-continue', self.continueAction)
    Event.on(self.el, 'click', '.dialog-close', self.closeAction)
    Event.one(self.el, 'animationend', self.tab)

    Event.keyOn('tab', self.tab)
    Event.keyOn('enter', self.continueAction)
    Event.keyOn('esc', self.closeAction)

    Event.key.setScope('dialog')
  },

  tab: function(event){
    if (event){ event.preventDefault() }

    if(document.activeElement != self.closeButton) {
      self.closeButton.focus()
    } else {
      self.continueButton.focus()
    }
  },

  closeAction: function(event){
    if (event){ event.preventDefault() }
    self.closeButton.focus()
    self.closeButton.classList.add('active')

    self.close(function(){
      if (self.options.onDismiss) {
        self.options.onDismiss()
      }
    })
  },

  continueAction: function(event){
    if (event){ event.preventDefault() }

    self.continueButton.focus()
    self.continueButton.classList.add('active')


    self.close(function(){
      if (self.options.submit) {
        if(self.options.submit.nodeType) {
          self.options.submit.submit()
        } else {
          form = document.querySelector(self.options.submit)
          if (form.dataset.remote == 'true') {
            Event.fire(form, 'submit')
          } else {
            form.submit()
          }
        }
      } else if (self.options.follow) {
        if(self.options.follow.match(/^https?:\/\//))
          window.location = self.options.follow
        else
          window.location.href = self.options.follow
      } if (self.options.onConfirm) {
        self.options.onConfirm()
      }
    })
  },

  close: function(callback){
    self.el.classList.add('dismiss')
    Event.one(self.el, 'animationend', function(event) {
      if (callback) { callback() }
      self.remove()
    })
  },

  remove: function(){
    Event.key.setScope('all')
    Event.keyOff('tab, enter, esc')
    Event.off(self.el, 'click')
    document.body.removeChild(self.el)
  }

}

Event.ready(function() {
  
  // Trigger is called when a DOM element with data-trigger=dialog is clicked
  // The data attributes are used as options for configuring a dialog
  //
  Event.on(document, 'click', '[data-trigger=dialog]', function(event){
    event.preventDefault()
    dialog.show(event.currentTarget.dataset)
  })
})

var self = dialog

module.exports = dialog
