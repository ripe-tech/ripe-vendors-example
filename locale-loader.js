import LocaleMap from "./locale.json";

export class ExampleLocaleLoaderPlugin extends global.RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this.brand = "example";
        this._bind();
    }

    getCapabilities() {
        return [global.RipeCommonsCapability.new("locale-loader")];
    }

    async loadLocale() {
        return {};
    }

    async unloadLocale() {
        const localePlugin = await this.owner.getPluginByName("locale");
        localePlugin.unsetLocaleMap(LocaleMap, `ripe_commons.${this.brand}`);
    }

    _bind() {
        this.owner.bind("config", async config => {
            if (!config || config.brand !== this.brand) {
                this.unloadLocale();
                return;
            }

            const localePlugin = await this.owner.getPluginByName("locale");
            localePlugin.setLocaleMap(LocaleMap, `ripe_commons.${this.brand}`);
        });
    }
}

ExampleLocaleLoaderPlugin.register(global.manager);
