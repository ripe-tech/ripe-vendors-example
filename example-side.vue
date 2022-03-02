<template>
    <div class="example-side">
        <h1>{{ __getLocale("hello_world") }}</h1>
        <example-picker v-bind:parts="pickerParts" />
    </div>
</template>

<style scoped>
.example-side {
    font: 20px;
}
</style>

<script>
import LocaleMap from "./locale.json";
import ExamplePicker from "./example-picker.vue";
import { logicMixin } from "./logic";

export const ExampleSide = {
    name: "example-side",
    components: {
        "example-picker": ExamplePicker
    },
    mixins: [logicMixin],
    data: function() {
        return {
            initialsExtra: {}
        };
    },
    computed: {
        brand() {
            return this.$store.state.brand;
        },
        model() {
            return this.$store.state.model;
        },
        options() {
            return this.$store.state.options;
        },
        pickerParts() {
            return Object.keys(this.options);
        }
    },
    watch: {
        model: {
            handler: function() {
                this.refresh();
            }
        }
    },
    methods: {
        refresh() {
            this.$store.dispatch("refreshInitialsData");
            this.onInitialsExtra = this.$bus.bind("personalization", personalize => {
                this.initialsExtra = personalize.initialsExtra;
            });
        },
        __getLocale(key) {
            let locale = this.$store.state.locale;
            locale = LocaleMap[locale] || LocaleMap.en_us;
            return locale[key];
        }
    }
};

export default ExampleSide;
</script>
