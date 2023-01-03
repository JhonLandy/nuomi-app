<script lang="ts" setup>
function click() {
    window.ipcRenderer.changeWindow("small");
}
</script>
<template>
    <section id="homepage">
        <v-card height="100%">
            <v-layout>
                <v-navigation-drawer
                    class="bg-deep-purple"
                    theme="dark"
                    permanent
                >
                    <v-list color="transparent">
                        <v-list-item
                            prepend-icon="mdi-view-dashboard"
                            title="Dashboard"
                        />
                        <v-list-item
                            prepend-icon="mdi-account-box"
                            title="Account"
                        />
                        <v-list-item
                            prepend-icon="mdi-gavel"
                            title="Admin"
                        />
                    </v-list>

                    <template #append>
                        <div class="pa-2">
                            <v-btn block> Logout </v-btn>
                        </div>
                    </template>
                </v-navigation-drawer>
                <v-main style="height: 100%">
                    <v-btn @click="click">变成小球</v-btn>
                </v-main>
            </v-layout>
        </v-card>
    </section>
</template>
<style lang="sass" scoped>
#homepage
    height: 100%
</style>
