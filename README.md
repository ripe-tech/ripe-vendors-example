# RIPE Vendors Example

Simple example repository to be used as skeleton.

## Setup
**In `ripe-vendors-example`**
- Change the project folder name and replace `example` by the brand's name
- Run `npm install`
- Find and replace the word `example` in the whole project by the brand name in lowercase. Ex: `swear`
- Find and replace the word `Example` in the whole project by the brand name capitalized. Ex: `Swear`
- Rename all the files that have `example` to the brand's name
- Run `npm link`

**In `ripe-white`**
- Run `npm link ripe-commons-<brand>`
- Update the file `ripe-white/js/main.js`:
    - Comment the line with ` await loadRemotePlugins();`
    - Comment the lines that are now unused (ripe-white doesn't allow unused code)
    - After the line `SwitchTechnicalPlugin.register(pluginus.manager);` add `require("ripe-commons-<brand>").install();`

## Development
**In `ripe-vendors-example`**
- Run `npm run watch`

**In `ripe-white`**
- Run `npm run dev`

**In the browser**
- Use `features=<brand-side>`
