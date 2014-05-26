var domify = require('domify')
var tpl = require('./dialog.html')
var classie = require('classie')
var oneBtn = require('./one_button.html')
var twoBtn = require('./two_button.html')
var k = require('k')(window)

var Wagon = require('wagon')

module.exports = Wagon.extend({

  events: {
    'click .dialog-continue': 'continueAction',
    'click .dialog-close': 'closeAction',
    'animationend': 'tab'
  },

  initialize: function(){
    this.options.close = options.close || 'Cancel'
    this.el = this.buildElement()
    this.bindKeyboardEvents()
  },

  bindKeyboardEvents: function(){
    k('tab', this.tab.bind(this))
    k('enter', this.continueAction.bind(this))
    k('esc', this.closeAction.bind(this))
  },

  remove: function(){
    k.unbind()
    Wagon.prototype.remove.apply(this, arguments)
  },

  show: function(){
    document.body.appendChild(this.html)
    return this
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
    classie.add(this.closeButton, 'active')

    this.close(function(){
      if (this.options.onDismiss) {
        this.options.onDismiss()
      }
    }.bind(this))
  },

  continueAction: function(event){
    if (event){ event.preventDefault() }

    this.continueButton.focus()
    classie.add(this.continueButton, 'active')


    this.close(function(){
      if (this.options.sumbit) {
        if(this.options.submit.nodeType) {
          this.options.submit.submit()
        } else {
          qwery(this.options.submit)[0].submit()
        }
      } else if (this.options.follow) {
        window.location.pathname = this.options.follow
      } if (this.options.onConfirm) {
        this.options.onConfirm()
      }
    }.bind(this))
  },

  close: function(callback){
    classie.add( this.html, 'dismiss' )
    animEvent.one(this.html, 'end', function(event) {
      if (callback) { callback() }
      this.remove()
    }.bind(this))
  },

  buildElement: function(){
    el = domify(tpl)

    if (this.options.continue) {
      el.querySelector('.dialog-actions').innerHTML = twoBtn 
      this.continueButton = el.querySelector('.dialog-continue')

      this.continueButton.textContent = this.options.continue

      if (this.options.destructive) {
        classie.remove(this.continueButton, 'primary-btn')
        classie.add(this.continueButton, 'primary-destroy-btn')
      }
    } else {
      el.querySelector('.dialog-actions').innerHTML = oneBtn 
    }

    this.closeButton = el.querySelector('.dialog-close')

    el.querySelector('.dialog-close').textContent = this.options.close

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

    return el
  }

}, {

  docEvents: {
    'click [data-trigger=dialog]': 'instantiate'
  },
  instantiate: function(event){
    event.preventDefault()
    this.show(event.target.dataset)
  },
  show: function(options){
    new this(options).show()
  }

})

// module.exports = {
//   'show': show,
//   'watch': watch
// }

// function show(options) {
//   return new Dialog(options).show()
// }

// function addDialog(event) {
//   console.log(event.target)
// }

// function watch() {
//   if (!watching) {
//     bean.on(qwery('body')[0], 'click', '[data-trigger=dialog]', function(event){
//       event.preventDefault()
//       show(event.target.dataset)
//     })
//     watching = true
//   }
// }

// function Dialog(options){
//   this.options = (options || {})
//   this.options.close = options.close || 'Cancel'

//   this.makeHTML()
//   this.bindEvents()
// }

// Dialog.prototype.makeHTML = function(){
//   this.html = domify(tpl)

//   if (this.options.continue) {
//     this.html.querySelector('.dialog-actions').innerHTML = twoBtn 
//     this.continueButton = this.html.querySelector('.dialog-continue')

//     this.continueButton.textContent = this.options.continue

//     if (this.options.destructive) {
//       classie.remove(this.continueButton, 'primary-btn')
//       classie.add(this.continueButton, 'primary-destroy-btn')
//     }
//   } else {
//     this.html.querySelector('.dialog-actions').innerHTML = oneBtn 
//   }

//   this.closeButton = this.html.querySelector('.dialog-close')

//   this.html.querySelector('.dialog-close').textContent = this.options.close

//   var message = this.html.querySelector('.dialog-message')

//   if (this.options.messageHTML) {
//     message.innerHTML = this.options.messageHTML
//   } else {
//     if (this.options.title) {
//       message.innerHTML += "<h2>" + this.options.title + "</h2>"
//     }
//     if (this.options.message) {
//       message.innerHTML += "<p>" + this.options.message + "</p>"
//     }
//   }

//   return this.html
// }

// Dialog.prototype.bindEvents = function(){

//   animEvent.one(this.html, 'end', this.tab.bind(this))

//   bean.one(this.closeButton, 'touchstart', tap(this.closeAction.bind(this)), false)
//   bean.one(this.closeButton, 'click',  this.closeAction.bind(this), false)

//   bean.one(this.continueButton, 'touchstart', tap(this.continueAction.bind(this)), false)
//   bean.one(this.continueButton, 'click', this.continueAction.bind(this), false)

//   k('tab', this.tab.bind(this))
//   k('enter', this.continueAction.bind(this))
//   k('esc', this.closeAction.bind(this))
// }

// Dialog.prototype.unbindEvents = function(){
//   k.unbind()
// }

// Dialog.prototype.show = function(){
//   document.body.appendChild(this.html)
//   return this
// }

// Dialog.prototype.tab = function(event){
//   if (event){ event.preventDefault() }

//   if(document.activeElement != this.closeButton) {
//     this.closeButton.focus()
//   } else {
//     this.continueButton.focus()
//   }
// }

// Dialog.prototype.closeAction = function(event){
//   if (event){ event.preventDefault() }
//   this.closeButton.focus()
//   classie.add(this.closeButton, 'active')

//   this.close(function(){
//     if (this.options.onDismiss) {
//       this.options.onDismiss()
//     }
//   }.bind(this))
// }

// Dialog.prototype.continueAction = function(event){
//   if (event){ event.preventDefault() }

//   this.continueButton.focus()
//   classie.add(this.continueButton, 'active')


//   this.close(function(){
//     if (this.options.sumbit) {
//       if(this.options.submit.nodeType) {
//         this.options.submit.submit()
//       } else {
//         qwery(this.options.submit)[0].submit()
//       }
//     } else if (this.options.follow) {
//       window.location.pathname = this.options.follow
//     } if (this.options.onConfirm) {
//       this.options.onConfirm()
//     }
//   }.bind(this))
// }

// Dialog.prototype.close = function(callback){
//   classie.add( this.html, 'dismiss' )
//   animEvent.one(this.html, 'end', function(event) {
//     if (callback) { callback() }
//     this.remove()
//   }.bind(this))
// }

// Dialog.prototype.remove = function(){
//   this.unbindEvents()
//   this.html.parentNode.removeChild(this.html)
//   return this
// }

// window.d = Dialog

