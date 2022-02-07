<template>
    <div class="example-side">
        HELLO WORLD
    </div>
</template>

<style scoped>
.example-side {
    font: 20px;
}
</style>

<script>
import LocaleMap from "./locale.json";

export const ExampleSide = {
    name: "example-side",
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
