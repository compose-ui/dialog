# Changelog

## 3.1.0
- Added `data-dialog-if="[selector]` - which only shows a dialog if the selector is found.

## 3.0.2
- Fixed event listener removal.

## 3.0.1
- Fixed submission event bubbling.

## 3.0.0
- Completely rewritten to do the same things but better.

## 2.0.3
- Now using self in place of this references.

## 2.0.2
- Removed reliance on brfs dependency.

## 2.0.1
- Minor fix to event reference.

## 2.0.0
- Removed Wagon dependency, fully rewritten.

## 1.0.5
- Now dialog supports following external URLs (containing beginning with http or https).

## 1.0.4
- Removed docEvents, deprecating from Wagon.

## 1.0.3

*Don't ask why we skipped a few versions...*

- Use `event.currentTarget` instead of `event.target` to get the element the event was originally bound to.

## 1.0.0
- Initial release
