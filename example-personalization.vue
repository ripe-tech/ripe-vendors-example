<template>
    <div v-bind:class="brand">
        <initials-images
            v-bind:brand="brand"
            v-bind:model="model"
            v-bind:groups="groups"
            v-bind:image-options="{ crop: true }"
            v-bind:initials-builder="initialsBuilder"
        />
        <component
            v-bind:initials-extra.sync="initialsExtra"
            v-if="form"
            v-bind:is="form"
            ref="form"
            v-on:update:valid="onValid"
        />
    </div>
</template>

<style scoped>
.example {
    display: flex;
    flex-direction: column;
    max-width: 600px;
}
</style>

<script>
import { logicMixin } from "./logic";

export const ExamplePersonalization = {
    extends: global.RipeCommonsPersonalizationForm.Interface,
    mixins: [logicMixin],
    data: function() {
        return {
            initialsExtra: {},
            valid: true
        };
    },
    computed: {
        group() {
            return this.groups?.length ? this.groups[0] : null;
        },
        groups() {
            return this.initialsGroups || [];
        },
        initials() {
            if (!this.group) return null;
            return this.initialsExtra[this.group]?.initials || "";
        },
        engraving() {
            if (!this.group) return null;
            return this.initialsExtra[this.group]?.engraving;
        },
        brand() {
            return this.$store.state.brand;
        },
        model() {
            return this.$store.state.model;
        },
        state() {
            const initialsExtra = {};
            this.groups.forEach(group => {
                if (this.initialsExtra?.[group]?.initials) {
                    initialsExtra[group] = Object.assign({}, this.initialsExtra[group]);
                }
            });
            return {
                initials: this.initials,
                engraving: this.engraving,
                initialsExtra: initialsExtra
            };
        },
        initialsBuilder() {
            return async (initials, engraving, group = null, viewport = null, context = null) => {
                initials = initials || "$empty";
                engraving = engraving || this.initialsExtra?.[group]?.engraving;
                const result = await this.$ripe._initialsBuilder(
                    initials,
                    engraving,
                    group,
                    viewport,
                    context
                );
                return {
                    initials: result.initials,
                    profile: [...result.profile]
                };
            };
        }
    },
    watch: {
        state: {
            handler: function() {
                this.$emit("changed", this);
            },
            deep: true
        },
        valid: {
            handler: function(value) {
                this.$emit("update:valid", value);
            },
            immediate: true
        }
    },
    created: async function() {
        if (this.form) {
            await this.$store.dispatch("refreshInitialsData");
            this.$refs.form.setup();
        }
    },
    methods: {
        reset() {
            this.initialsExtra = {};
        },
        setState(state) {
            this.initialsExtra = state.initialsExtra || {};
        },
        getState() {
            return this.state;
        },
        getTabMessage() {
            return this.groups
                .map(group => this.initialsExtra?.[group]?.initials || "")
                .join(" ")
                .trim();
        },
        onValid(value) {
            this.valid = value;
        }
    }
};

export default ExamplePersonalization;
</script>
