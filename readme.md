# Web SDK template

A highly adaptable JavaScript package for web development, compatible with all major frameworks, and easily customizable to fit your project's unique requirements.

## Installation

using npm

```sh
npm install @aycom366/web-sdk-template
```

## Note

- This package should only be used on the client side.
- The `setup()` method should be invoked before any other method.

## Usage

### with React

```js
import CorePackage, { MessageEvents } from "@aycom366/web-sdk-template";

function App() {
  const openWidget = useCallback(() => {
    const widgetPackage = new CorePackage({
      onEvent(event, data) {
        switch (event) {
          case MessageEvents.WIDGET_LOADED:
            console.log("loaded", data);
            break;
          case MessageEvents.WIDGET_CLOSED:
            console.log("closed", data);
            break;
          case MessageEvents.WIDGET_OPENED:
            console.log("widget opened", data);
            break;
          case MessageEvents.WIDGET_LOAD_ERROR:
            console.log("widget load error", data);
            break;
        }
      },
      //sdk requires always key, so this is an example
      publicKey: "Ayomide",

      //The meta below could be anything
      meta: {
        order_ref: "kjdjkdjkdjds",
        custom: "pass anything",
      },
    });
    //setup should be called before any other method is invoked.
    widgetPackage.setup();
    widgetPackage.open();
  }, []);

  return (
    <>
      <button onClick={openWidget}>open widget</button>
    </>
  );
}
```

### with Vue

```js
<script setup lang="ts">
import CorePackage, { MessageEvents } from '@aycom366/web-sdk-template'

function openWidget() {
  const widgetPackage = new CorePackage({
    onEvent(event, data) {
      switch (event) {
        case MessageEvents.WIDGET_LOADED:
          console.log('loaded', data)
          break
        case MessageEvents.WIDGET_CLOSED:
          console.log('closed', data)
          break
        case MessageEvents.WIDGET_OPENED:
          console.log('widget opened', data)
          break
        case MessageEvents.WIDGET_LOAD_ERROR:
          console.log('widget load error', data)
          break
      }
    },
    publicKey: 'Ayomide',
    meta: {
      order_ref: 'kjdjkdjkdjds',
      custom: 'pass anything'
    }
  })
  widgetPackage.setup()
  widgetPackage.open()
}
</script>

<template>
  <button @click="openWidget">Open Widget</button>
</template>

```

## Examples

see more examples [here](/examples)

## Testing Package Locally

If you'd like to test this package locally before publishing to npm

- run `npm run build` to build the package into a dist folder.
- run `npm pack` to create a tarball.tgz file of the package.
  This tarball contains the package's source code, along with its package.json and any other files specified in the files field of the package's package.json (if the field exists).
- copy the tarball.tgz file generated into the root directory of project you'd like to test it on
- run `npm install tarball.tgz file generated` to install the package
  Example: `npm install ./aycom366-web-sdk-template-1.0.0.tgz`
- Then start using the package as if you've installed it from npm.
