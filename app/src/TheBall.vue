<template>
    <div class="ballBox">
        <span class="percent">
            {{ usage }}
            <span class="unit">% </span>
        </span>
    </div>
</template>
<script lang="ts">
export default {
    name: "App",
    data() {
        return {
            usage: 0,
            message: "221",
        };
    },
    mounted() {
        this.listenCpuUsage();
    },
    methods: {
        listenCpuUsage() {
            window.ipcRenderer.on("usage", (_, usage) => {
                this.usage = Number((usage * 100).toFixed(0));
            });
        },
    },
};
</script>
<style lang="sass" scoped>
.ballBox
    width: 60px
    height: 60px
    line-height: 60px
    text-align: center
    cursor: pointer
    border-radius: 50%
    opacity: .8
    box-sizing: border-box
    background: #293541
    .percent
        font-size: 18px
        color: white
    .unit
        font-size: 8px
</style>
