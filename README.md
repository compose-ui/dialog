# Dialog [![Build Status](https://travis-ci.org/compose-ui/dialog.svg?branch=master)](https://travis-ci.org/compose-ui/dialog)

A nice dialog component.

![Preview](../../blob/master/preview.png?raw=true)

## Installation

- `npm install compose-dialog`
- Profit.

## Usage

There are a few ways to instantiate a dialog.

### DOM only (almost)

Using the `data-trigger="dialog"` attribute on anything will trigger showing a Dialog with the provided options (as `data-` attributes.)

```html
<button class="btn" 
  data-trigger="dialog"
  data-title="Leaving Already?"
  data-message="But we were having so much fun…"
  data-continue="Peace out"
  data-close="Stick around"
  data-follow="/session/destroy/"
>Open a dialog</button>
```

**NOTE**: You do have to `require('compose-dialog')` at some point though.

### Programmatically

```javascript
var Dialog = require('compose-dialog')

Dialog.show({ /* options */})
```

This will handle all there is to handle for showing a Dialog.

### Programmatically (alternate)

```javascript
var Dialog = require('compose-dialog')

new Dialog({ /* options */}).show()
```

## Options

TODO
