import FormExample from "./form-example.vue";

export const logicMixin = {
    computed: {
        model() {
            return this.$store.state.model;
        },
        modelType() {
            if (this.model) return "generic";
            else return null;
        },
        form() {
            switch (this.modelType) {
                case "generic":
                    return FormExample;
                default:
                    return null;
            }
        }
    }
};
