import { ExampleSide } from "./example-side.vue";
import { ExamplePersonalization } from "./example-personalization.vue";
import spec from "./package.json";

export class ExampleSidePlugin extends global.RipeCommonsPlugin {
    constructor(owner) {
        super(owner);
        this.name = spec.shortName;
        this.version = spec.version;
        this.meta.brand = spec.shortName;
    }

    getCapabilities() {
        return [
            // enables the feature "example-side" on the side panel
            global.RipeCommonsCapability.new("component"),
            global.RipeCommonsCapability.new("component-side-top"),
            global.RipeCommonsCapability.new("component-bottom"),
            // enables the feature "example-side" on the personalization modal
            global.RipeCommonsCapability.new("personalization")
        ];
    }

    getFeatures() {
        return ["example-side"];
    }

    async getComponent() {
        return ExampleSide;
    }

    async getPersonalizationComponent() {
        return ExamplePersonalization;
    }
}

export const install = (manager = global.manager) => ExampleSidePlugin.register(manager);

install();

export default ExampleSidePlugin;
