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

### `dialog-if`

Using `data-dialog-if="[selector]"` you can only trigger a dialog if the selector is found. So for example if you
only want to show a dialog if a checkbox is checked.

```
data-dialog-title="Are you sure?" data-dialog-if="#form_id .dangerous-checkbox:checked"
```

Now when the element is clicked, the event will be stopped and the dialog will be shown only if the checkbox is
checked.
