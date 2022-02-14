<template>
    <div class="form-example">
        <div class="" v-for="(group, index) in groups" v-bind:key="group">
            <input-ripe
                class="input-initials"
                v-bind:value.sync="initialsText[group]"
                v-bind:max-length="initialsMaximumCharacters"
                v-on:update:value="value => onInput(group, value)"
            />
            <form-input
                class="form-initials"
                v-bind:header="'Text'"
                v-bind:header-size="'large'"
            >
                <input-ripe
                    class="input-initials"
                    v-bind:value.sync="initialsText[group]"
                    v-bind:max-length="maxInitials[group]"
                    v-on:update:value="value => onInput(group, value)"
                />
            </form-input>
            <div class="properties-selection">
                <form-input
                    class="form-select"
                    v-bind:header-size="'large'"
                    v-for="(options, type) in propertyOptions[group]"
                    v-bind:key="type"
                >
                    <div class="select-icon">
                        <select-ripe
                            v-bind:class="classesSelect(group, type)"
                            v-bind:options="options"
                            v-bind:value="propertiesData[group][type]"
                            v-on:update:value="value => onPropertiesUpdate(group, type, value)"
                        />
                        <icon
                            v-bind:color="'#929292'"
                            v-bind:icon="'chevron-down'"
                            v-bind:width="20"
                        />
                    </div>
                </form-input>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-example > .groups {
    display: flex;
    flex-direction: row;
}

body.mobile .form-example > .groups {
    flex-direction: column;
}

.form-example > .groups > .initials-group {
    width: 370px;
}

body.mobile .form-example > .groups > .initials-group {
    width: unset;
}

.form-example > .groups > .initials-group:first-child:not(:last-child) {
    margin-right: 20px;
}

body.mobile .form-example > .groups > .initials-group:first-child:not(:last-child) {
    margin-right: 0px;
}  
</style>

<script>

export const formExample = {
    props: {
        initialsExtra: {
            type: Object,
            default: () => ({})
        }
    },
    data: function() {
        return {
            propertiesData: {},
            propertyOptions: {},
            initialsText: {}
        };
    },
    computed: {
        group() {
            return this.groups ? this.groups[0] : null;
        },
        groups() {
            if (!this.initialsGroups) return null;
            return this.initialsGroups[0];
        },
        configInitials() {
            return this.$store.state.config?.initials || {};
        },
        properties() {
            const properties = this.configInitials.properties?.map(property => ({
                value: property.name,
                label: this.locale(
                    `properties.${property.type}.${property.name}`,
                    this.readable(this.capitalize(property.name))
                ),
                type: property.type
            }));
            const result = {};
            properties &&
                properties.forEach(property => {
                    result[property.type] = result[property.type] || [];
                    result[property.type].push(property);
                });
            return result;
        },
        valid() {
            let valid = true;
            Object.entries(this.initialsExtra).forEach(([group, initialsExtra]) => {
                const initialsLength = initialsExtra.initials.length;
                if (initialsLength < this.initialsMinimumCharacters || initialsLength > this.initialsMinimumCharacters) {
                    valid = false;
                }
            });
            return valid;
        }
    },
    watch: {
        initialsExtra: {
            handler: function(value, prevValue) {
                if (JSON.stringify(value) === JSON.stringify(prevValue)) return;
                this.setup();
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
    methods: {
        setup() {
            if (!this.groups) return;
            this.initialsText = {};
            this.groups.forEach(group => {
                if (!this.initialsExtra[group] || this.initialsExtra[group]?.initials === "") {
                    this.$set(this.initialsText, group, "");
                    this.clearSelects();
                } else {
                    this.$set(this.initialsText, group, this.initialsExtra[group]?.initials || "");
                }
            });
            this.setPropertyOptions();
        },
        setPropertyOptions() {
            this.groups.forEach(group => {
                this.$set(this.propertiesData, group, this.propertiesData[group] || {});
                const selectedEngraving = {};

                const engraving = this.initialsExtra[group]?.engraving;
                if (engraving) {
                    Object.entries(this.$ripe.parseEngraving(engraving).valuesM).forEach(
                        ([type, value]) => (selectedEngraving[type] = value)
                    );
                }

                this.$set(this.propertyOptions, group, {});
                for (const [type, options] of Object.entries(this.properties)) {
                    this.$set(this.propertyOptions[group], type, options);
                    this.$set(
                        this.propertiesData[group],
                        type,
                        selectedEngraving[type] ||
                            this.propertiesData[group][type] ||
                            this.propertyOptions[group][type][0].value
                    );
                }
                this.updateInitialsExtra();
            });
        },
        clearSelects() {
            this.groups.forEach(group => {
                this.$set(this.propertiesData, group, {});
            });
        },
        propertiesDataToEngraving(group = null) {
            group = group || Object.keys(this.propertiesData)[0];
            if (!group || !this.propertiesData[group]) return null;
            let propertyProfiles = Object.entries(this.propertiesData[group])
                .filter(([type, value]) => Boolean(value))
                .map(([type, value]) => `${value}:${type}`);
            return propertyProfiles.join(".");
        },
        updateInitialsExtra() {
            this.groups.forEach(group => {
                this.$set(this.initialsExtra, group, {
                    initials: this.__getInitialsText(group),
                    engraving: this.propertiesDataToEngraving(group)
                });
            });
            this.$emit("update:initials-extra", this.initialsExtra);
            this.$ripe.update({ initialsExtra: this.initialsExtra }, { force: true });
        },
        onInput(group, value) {
            this.$set(this.initialsText, group, value);
            this.updateInitialsExtra();
        },
        onPropertiesUpdate(group, type, value) {
            this.$set(this.propertiesData[group], type, value);
            this.updateInitialsExtra();
        },
        __getInitialsText(group = null) {
            if (!group && this.groups?.length > 0) group = this.groups[0];
            return this.initialsText[group] || "";
        },
        __getLocale(key) {
            let locale = this.$store.state.locale;
            locale = LocaleMap[locale] || LocaleMap.en_us;
            return locale[key];
        }
    }
};

export default formExample;
</script>
