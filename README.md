# Dialog [![Build Status](https://travis-ci.org/compose-ui/dialog.svg?branch=master)](https://travis-ci.org/compose-ui/dialog)

A nice dialog component.

![Preview](../../blob/master/preview.png?raw=true)

## Installation

- `npm install compose-dialog`
- Profit.

## Usage

There are a few ways to instantiate a dialog.

### DOM only (almost)

Using the `data-dialog-title="Some title"` attribute on anything will trigger showing a Dialog with the provided options (as `data-dialog` attributes.)

```html
<button class="btn" 
  data-dialog-title="Leaving Already?"
  data-dialog-description="But we were having so much fun…"
  data-dialog-continue="Peace out"
  data-dialog-close="Stick around"
  data-dialog-follow="/session/destroy/"
>Open a dialog</button>
```

```html
<button
  data-dialog-confirm="true"
  data-dialog-title="Delete this user?"
  data-dialog-description="Deleting a user is a permanent action. Are you sure?"
>Delete User</button>
```

**NOTE**: You do have to `require('compose-dialog')` at some point though.

### Programmatically

```javascript
var Dialog = require('compose-dialog')

Dialog.show({ /* options */})
```

This will handle all there is to handle for showing a Dialog.

## Options

TODO
