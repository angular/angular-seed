# Roman-Numerals

this is a sample app for learning angular development and testing patterns.

To get started:

fork this repository
clone you fork to your local machine
run `npm install`

You are now setup and ready to create an app.

To host the app run 

`npm start`

to Test the app rubn

`npm test`

----

The app source code should reside in the `./app` folder.

----

Angular 1.5+ uses components as the main view pattern. Each component has it's own folder
under the `app/components` sub folder.  A component includes the following files:

```
/{component-name}
   {component-name}.js
   {component-name}.spec.js
   {component-name}.tpl.html
   {component-name}.css.js
```

any constants and values should be defined in the `{component-name}.js` file


A component can also include other objects as necessary:

- controller
- service
- factory
- directive
- filter


Global objects (that are shared across components) such as 
- `services`
- `factories`
- `filters`
- `directives`
 
 can be included in the `app/common` folder

