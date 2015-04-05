# Disable-When-Hidden
Very fast angular directive to remove the watchers related to elements outside of the viewport. No DOM manipulation.

*Note:
This directive use the debug information provided by Angular by default, however we can disable it since 1.3 so if you did it (and you probably should have), it won't work.*

## Usage
We have 2 directives.

The first one to put on the parent element that contains the elements you want to disable, and the 2nd one to put on every element you wish to hide.

I'll copy the basic example to explain better, here is a simple `ngRepeat`:

```javascript
<div disable-when-hidden>
  <div ng-repeat="item in list.array" class="item" dwh-element>
    <p ng-bind='item.title'></p>
  </div>
</div>
```
`DisableWhenHidden`registers a listener to a scroll event on the document, that will broadcast an event to alert every `dwhElement` to either disable watchers, re-enable them or do nothing.
