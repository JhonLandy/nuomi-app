<template>
    <div class="app">{{ message }}</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: "App",
    data() {
        return {
            message: process.env.VUE_APP_ENV + "221",
        };
    },
    mounted() {
        console.log(process.env.VUE_APP_ENV);
    },
});
</script>
<style lang="sass" scoped>
$color: red
.app
  background: $color
</style>
