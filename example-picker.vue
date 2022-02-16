<template>
    <div class="example-picker">
        <div class="picker" v-for="part in pickerItems" v-bind:key="part.name">
            <div class="color">
                {{ getPartColor(part.name) }}
            </div>
            <button-group-swatch
                v-bind:variant="'thin'"
                v-bind:items="part.items"
                v-bind:value="part.value"
                v-on:update:value="value => onPicker(part.name, value)"
            />
        </div>
    </div>
</template>

<style scoped>
.example-picker > .picker {
    margin-top: 20px;
}

.example-picker .color {
    font-weight: 600;
}

.example-picker ::v-deep .button-group-swatch.thin .swatch > .swatch-image {
    border: 2px solid transparent;
    height: 50px;
    width: 50px;
}

.example-picker ::v-deep .button-group-swatch.thin .swatch.selected > .swatch-image,
.example-picker ::v-deep .button-group-swatch.thin .swatch:hover:not(.disabled) > .swatch-image {
    border-color: #000000;
}

.example-picker ::v-deep .button-group-swatch.thin .swatch {
    margin-right: 7px;
}

body.mobile .example-picker ::v-deep .button-group-swatch.thin .swatch {
    margin: 0px 10px 0px 0px;
}
</style>

<script>

export const ExamplePicker = {
    name: "example-picker",
    props: {
        parts: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        options() {
            return this.$store.state.options;
        },
        selectedParts() {
            return this.$store.getters.getParts();
        },
        pickerItems() {
            return this.parts.map(part => {
                const items = [];
                Object.entries(this.options[part]).forEach(([material, colors]) => {
                    colors.forEach(color => {
                        items.push({
                            value: [material, color].join(":"),
                            url: this.$ripe._getSwatchURL({
                                color: color,
                                material: material,
                                retina: true
                            }),
                            label: false
                        });
                    });
                });
                const value = [
                    this.selectedParts[part].material,
                    this.selectedParts[part].color
                ].join(":");
                return {
                    name: part,
                    items: items,
                    value: value
                };
            });
        }
    },
    methods: {
        onPicker(part, value) {
            this.setPart(part, ...value.split(":"));
        },
        getPartColor(part) {
            return this.locale(`colors.${this.selectedParts[part].color}`);
        }
    }
};

export default ExamplePicker;
</script>
