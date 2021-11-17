# ts-node-restarter
A cli tool for restarting your node.js server when files change

## Install
```
yarn add ts-node-restarter
```
or
```
npm install ts-node-restarter
```
## CLI
You can use ts-node-restarter by cli, such as

```
 yarn ts-node-restarter index.js
```
or
```
 npm run ts-node-restarter index.js
```

## Script
Or you can use ts-node-restarter by script, such as

```
  "scripts": {
    "restarter": "ts-node-restarter index.js"
  }
```
and run
```
yarn restarter
```

## Settings

add a <b>restarter.json</b> in your project root directory, and add watching files path, such as
```
{
  "watch": ["index.js"]
}

```
