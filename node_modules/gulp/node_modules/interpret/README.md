# interpret
> A dictionary of file extensions and associated module loaders.

[![NPM](https://nodei.co/npm/interpret.png)](https://nodei.co/npm/interpret/)

## What is it
This is used by [rechoir](http://github.com/tkellen/node-rechoir) for registering module loaders.

## API

### extensions
Map file types to modules which provide a [require.extensions] loader.
```js
{
  '.co': 'coco',
  '.coffee': 'coffee-script/register',
  '.csv': 'require-csv',
  '.iced': 'iced-coffee-script/register',
  '.ini': 'require-ini',
  '.js': null,
  '.json': null,
  '.litcoffee': 'coffee-script/register',
  '.ls': 'livescript',
  '.toml': 'toml-require',
  '.xml': 'require-xml',
  '.yaml': 'require-yaml',
  '.yml': 'require-yaml'
}
```

### register
Check here to see if setup is needed for the module register itself with [require.extensions].  If a method is returned, call it with the module.
```js
{
  'toml-require': function (module) {
    module.install();
  }
}
```

### jsVariants
Extensions which are javascript variants.

```js
{
  '.co': 'coco',
  '.coffee': 'coffee-script/register',
  '.iced': 'iced-coffee-script/register',
  '.js': null,
  '.litcoffee': 'coffee-script/register',
  '.ls': 'livescript'
}
```

[require.extensions]: http://nodejs.org/api/globals.html#globals_require_extensions
