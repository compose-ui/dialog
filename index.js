var fs = require('fs')
var domify = require('domify')
var tpl = fs.readFileSync(__dirname + '/dialog.html', 'utf8')
var classie = require('classie')
var oneBtn = fs.readFileSync(__dirname + '/one_button.html', 'utf8')
var twoBtn = fs.readFileSync(__dirname + '/two_button.html', 'utf8')
var key = require('keymaster')
var qwery = require('qwery')
var animEvent = require('animevent')

var Wagon = require('wagon')

module.exports = Wagon.extend({

  events: {
    'click .dialog-continue': 'continueAction',
    'click .dialog-close': 'closeAction',

    one: {
      'animationend': 'tab'
    }
  },

  initialize: function(){
    this.options.close = this.options.close || 'Cancel'
    this.render()
    this.bindKeyboardEvents()
  },

  bindKeyboardEvents: function(){
    key('tab', this.tab.bind(this))
    key('enter', this.continueAction.bind(this))
    key('esc', this.closeAction.bind(this))
  },

  remove: function(){
    key.unbind('tab, enter, esc')
    Wagon.prototype.remove.apply(this, arguments)
  },

  show: function(){
    document.body.appendChild(this.el)
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
      if (this.options.submit) {
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
    classie.add( this.el, 'dismiss' )
    animEvent.one(this.el, 'end', function(event) {
      if (callback) { callback() }
      this.remove()
    }.bind(this))
  },

  render: function(){
    var el = domify(tpl)

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

    this.el = el
    return this
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
