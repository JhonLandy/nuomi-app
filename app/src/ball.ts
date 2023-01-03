import TheBall from "@src/TheBall.vue";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "./css/index.sass";
const vuetify = createVuetify({
    components,
    directives,
});

createApp(TheBall).use(vuetify).mount("#app");
