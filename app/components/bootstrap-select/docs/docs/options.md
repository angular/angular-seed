# Core options

---

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in 
`data-style=""` or `data-selected-text-format="count"`.

<table class="table table-bordered table-striped">
  <thead>
  <tr>
    <th style="width: 15%;">Name</th>
    <th style="width: 32%;">Type</th>
    <th style="width: 10%;">Default</th>
    <th style="width: 43%;">Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>actionsBox</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>When set to <code>true</code>, adds two buttons to the top of the dropdown menu (<strong>Select All</strong> &amp; <strong>Deselect All</strong>).</p>
    </td>
  </tr>
  <tr>
    <td>container</td>
    <td>string | false</td>
    <td><code>false</code></td>
    <td>
        <p>When set to a string, appends the select to a specific element or selector, e.g., 
        <code>container: 'body' | '.main-body'</code></p>
    </td>
  </tr>
  <tr>
    <td>countSelectedText</td>
    <td>string | function</td>
    <td><code>function</code></td>
    <td>
      <p>Sets the format for the text displayed when selectedTextFormat is <code>count</code> or <code>count > 
      #</code>. {0} is the selected amount. {1} is total available for selection.</p>
      <p>When set to a function, the first parameter is the number of selected options, and the second is the total number of 
      options. The function must return a string.</p>
    </td>
  </tr>
  <tr>
    <td>dropupAuto</td>
    <td>boolean</td>
    <td><code>true</code></td>
    <td>
      <p>checks to see which has more room, above or below. If the dropup has enough room to fully open normally, but
      there is more room above, the dropup still opens normally. Otherwise, it becomes a dropup. If dropupAuto is
      set to false, dropups must be called manually.</p>
    </td>
  </tr>
  <tr>
    <td>header</td>
    <td>string</td>
    <td><code>false</code></td>
    <td>
      <p>adds a header to the top of the menu; includes a close button by default</p>
    </td>
  </tr>
  <tr>
    <td>hideDisabled</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>removes disabled options and optgroups from the menu <code>data-hide-disabled: true</code></p>
    </td>
  </tr>
  <tr>
    <td>liveSearch</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>When set to <code>true</code>, adds a search box to the top of the selectpicker dropdown.</p>
    </td>
  </tr>
  <tr>
    <td>liveSearchPlaceholder</td>
    <td>string</td>
    <td><code>null</code></td>
    <td>
      <p>When set to a string, a placeholder attribute equal to the string will be added to the liveSearch input.</p>
    </td>
  </tr>
  <tr>
    <td>maxOptions</td>
    <td>integer | false</td>
    <td><code>false</code></td>
    <td>
      <p>When set to an integer and in a multi-select, the number of selected options cannot exceed the given value.</p>
      <p>This option can also exist as a data-attribute for an <code>&lt;optgroup&gt;</code>, in which case it only 
      applies to that <code>&lt;optgroup&gt;</code>.</p>
    </td>
  </tr>
  <tr>
    <td>mobile</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>When set to <code>true</code>, enables the device's native menu for select menus.</p>
    </td>
  </tr>
  <tr>
    <td>multipleSeparator</td>
    <td>string</td>
    <td><code>', '</code></td>
    <td>
      <p>Set the character displayed in the button that separates selected options.</p>
    </td>
  </tr>
  <tr>
    <td>noneSelectedText</td>
    <td>string</td>
    <td><code>'Nothing selected'</code></td>
    <td>
      <p>The text that is displayed when a multiple select has no selected options.</p>
    </td>
  </tr>
  <tr>
    <td>selectedTextFormat</td>
    <td><code>'values'</code> | <code>'static'</code> | <code>'count'</code> | <code>'count > x'</code> (where x is an integer)</td>
    <td><code>'values'</code></td>
    <td>
      <p>Specifies how the selection is displayed with a multiple select.</p>
    </td>
  </tr>
  <tr>
    <td>selectOnTab</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>When set to <code>true</code>, treats the tab character like the enter or space characters within the 
      selectpicker dropdown.</p>
    </td>
  </tr>
  <tr>
    <td>showContent</td>
    <td>boolean</td>
    <td><code>true</code></td>
    <td>
      <p>When set to <code>true</code>, display custom HTML associated with selected option(s) in the button. When set 
       to <code>false</code>, the option value will be displayed instead.</p>
    </td>
  </tr>
  <tr>
    <td>showIcon</td>
    <td>boolean</td>
    <td><code>true</code></td>
    <td>
      <p>When set to <code>true</code>, display icon(s) associated with selected option(s) in the button.</p>
    </td>
  </tr>
  <tr>
    <td>showSubtext</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>When set to <code>true</code>, display subtext associated with a selected option in the button.</p>
    </td>
  </tr>
  <tr>
    <td>showTick</td>
    <td>boolean</td>
    <td><code>false</code></td>
    <td>
      <p>Show checkmark on selected option (for items without <code>multiple</code> attribute).</p>
    </td>
  </tr>
  <tr>
    <td>size</td>
    <td><code>'auto'</code> | integer | false</td>
    <td><code>'auto'</code></td>
    <td>
      <p>When set to <code>'auto'</code>, the menu always opens up to show as many items as the window will allow
      without being cut off.</p>
      <p>When set to an integer, the menu will show the given number of items, even if the dropdown is cut off.</p>
      <p>When set to <code>false</code>, the menu will always show all items.</p>
    </td>
  </tr>
  <tr>
    <td>style</td>
    <td>string | null</td>
    <td><code>null</code></td>
    <td>
      <p>When set to a string, add the value to the button's style.</p>
    </td>
  </tr>
  <tr>
    <td>title</td>
    <td>string | null</td>
    <td><code>null</code></td>
    <td>
      <p>The default title for the selectpicker.</p>
    </td>
  </tr>
  <tr>
    <td>width</td>
    <td><code>'auto'</code> | <code>'fit'</code> | css-width | false (where <code>css-width</code> is a CSS width with units, e.g. <code>100px</code>)</td>
    <td><code>false</code></td>
    <td>
      <p>When set to <code>auto</code>, the width of the selectpicker is automatically adjusted to accommodate the 
      widest option.</p>
      <p>When set to a css-width, the width of the selectpicker is forced inline to the given value.</p>
      <p>When set to <code>false</code>, all width information is removed.</p>
    </td>
  </tr>
  </tbody>
</table>

# Events

---

Bootstrap-select exposes a few events for hooking into select functionality.

hide.bs.select, hidden.bs.select, show.bs.select, and shown.bs.select all have a `relatedTarget` property, whose value is the toggling anchor element.

<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <th>Event Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>loaded.bs.select</td>
      <td>This event fires after the select has been initialized.</td>
    </tr>
    <tr>
      <td>changed.bs.select</td>
      <td>This event fires after the select's value has been changed. It passes through event, clickedIndex, newValue, oldValue.</td>
    </tr>
    <tr>
      <td>show.bs.select</td>
      <td>This event fires immediately when the show instance method is called.</td>
    </tr>
    <tr>
      <td>shown.bs.select</td>
      <td>This event is fired when the dropdown has been made visible to the user (will wait for CSS transitions, to complete).</td>
    </tr>
    <tr>
      <td>hide.bs.select</td>
      <td>This event is fired immediately when the hide instance method has been called.</td>
    </tr>
    <tr>
      <td>hidden.bs.select</td>
      <td>This event is fired when the dropdown has finished being hidden from the user (will wait for CSS transitions, to complete).</td>
    </tr>
    <tr>
      <td>rendered.bs.select</td>
      <td>This event fires after the render instance has been called.</td>
    </tr>
    <tr>
      <td>refreshed.bs.select</td>
      <td>This event fires after the refresh instance has been called.</td>
    </tr>
  </tbody>
</table>

```js
$('#mySelect').on('hidden.bs.select', function (e) {
  // do something...
});
```
