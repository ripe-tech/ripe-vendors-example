# RIPE Vendors Example

Simple example repository to be used as skeleton.

## Build

```bash
npm run build
```

## Release

```bash
npm run build-cdn
```

## RIPE White - Hot Reload

To be able to use "hot reload" with [RIPE White](https://github.com/ripe-tech/ripe-white) use the following steps:

```bash
npm link
npm run watch
```

On the RIPE white directory use `npm link` to link the plugin project.

```bash
npm link ripe-commons-diverge
```

Then add the following code to the [`main.js`](https://github.com/ripe-tech/ripe-white/blob/master/js/main.js) of RIPE White on the `onLoad()` function after the plugin register and comment `loadRemotePlugins()` function that loads the remote plugins to prevent override.

```javascript
require("ripe-commons-diverge").install();
```

The `main.js` file would look something like

```javascript
...
    // await loadRemotePlugins();
...
    PartsTechnicalPlugin.register(pluginus.manager);
    StatsTechnicalPlugin.register(pluginus.manager);

    // linked plugins installation/registration
    require("ripe-commons-diverge").install();
...
```

### Deploy

To create a new release, a new [tag must be created](https://git-scm.com/book/en/v2/Git-Basics-Tagging), to automatically trigger a GitHub action. 