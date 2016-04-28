var fs = require('fs')
var domify = require('domify')
var tpl = fs.readFileSync(__dirname + '/templates/dialog.html', 'utf8')
var oneBtn = fs.readFileSync(__dirname + '/templates/one_button.html', 'utf8')
var twoBtn = fs.readFileSync(__dirname + '/templates/two_button.html', 'utf8')
var event = require('compose-event')

var dialog = {
  show: function(options) {
    this.options = options
    this.render()
    this.listen()

    return this
  },

  render: function() {
    var el = domify(tpl)

    // Add continue button from two button template and set the 
    // style and label of the button based on options
    //
    if (this.options.continue) {
      el.querySelector('.dialog-actions').innerHTML = twoBtn
      this.continueButton = el.querySelector('.dialog-continue')

      this.continueButton.textContent = this.options.continue

      if (this.options.destructive) {
        this.continueButton.classList.remove('primary-btn')
        this.continueButton.classList.add('primary-destroy-btn')
      }
    } else {
      el.querySelector('.dialog-actions').innerHTML = oneBtn
    }

    this.closeButton = el.querySelector('.dialog-close')

    el.querySelector('.dialog-close').textContent = this.options.close || 'Cancel'


    var message = el.querySelector('.dialog-message')

    if (this.options.messageHTML) {
      message.innerHTML = this.options.messageHTML
    } else {
      if (this.options.title) {
        message.innerHTML += "<h2>" + this.options.title + "</h2>"
      }
      if (this.options.message) {
        message.innerHTML += "<p>" + this.options.message + "</p>"
      }
    }

    this.el = el
    document.body.appendChild(this.el)
  },

  listen: function() {
    event.on(this.el, 'click', '.dialog-continue', this.continueAction.bind(this))
    event.on(this.el, 'click', '.dialog-close', this.closeAction.bind(this))
    event.one(this.el, 'animationend', this.tab.bind(this))

    event.keyOn('tab', this.tab.bind(this))
    event.keyOn('enter', this.continueAction.bind(this))
    event.keyOn('esc', this.closeAction.bind(this))

    event.key.setScope('dialog')
  },

  tab: function(event){
    if (event){ event.preventDefault() }

    if(document.activeElement != this.closeButton) {
      this.closeButton.focus()
    } else {
      this.continueButton.focus()
    }
  },

  closeAction: function(event){
    if (event){ event.preventDefault() }
    this.closeButton.focus()
    this.closeButton.classList.add('active')

    this.close(function(){
      if (this.options.onDismiss) {
        this.options.onDismiss()
      }
    }.bind(this))
  },

  continueAction: function(event){
    if (event){ event.preventDefault() }

    this.continueButton.focus()
    this.continueButton.classList.add('active')


    this.close(function(){
      if (this.options.submit) {
        if(this.options.submit.nodeType) {
          this.options.submit.submit()
        } else {
          form = document.querySelector(this.options.submit)
          if (form.dataset.remote == 'true') {
            event.fire(form, 'submit')
          } else {
            form.submit()
          }
        }
      } else if (this.options.follow) {
        if(this.options.follow.match(/^https?:\/\//))
          window.location = this.options.follow
        else
          window.location.href = this.options.follow
      } if (this.options.onConfirm) {
        this.options.onConfirm()
      }
    }.bind(this))
  },

  close: function(callback){
    this.el.classList.add('dismiss')
    event.one(this.el, 'animationend', function(event) {
      if (callback) { callback() }
      this.remove()
    }.bind(this))
  },

  remove: function(){
    event.key.setScope('all')
    event.keyOff('tab, enter, esc')
    event.off(this.el, 'click')
    document.body.removeChild(this.el)
  }

}

event.ready(function() {
  
  // Trigger is called when a DOM element with data-trigger=dialog is clicked
  // The data attributes are used as options for configuring a dialog
  //
  event.on(document, 'click', '[data-trigger=dialog]', function(event){
    event.preventDefault()
    dialog.show(event.currentTarget.dataset)
  })
})


module.exports = dialog
