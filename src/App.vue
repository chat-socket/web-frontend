<script setup lang="ts">

import FadeTransition from './components/reusables/transitions/FadeTransition.vue';
import {useSettingsStore} from "./stores/settings";

const settings = useSettingsStore();

// fix height on mobile screens
// todo add video calling
// todo refactor tailwind classes


const vh = () => {
    return `${window.innerHeight}px`;
};
</script>

<template>
    <div :class="{ 'dark': settings.isDarkMode }">
        <div class="bg-white dark:bg-gray-800 transition-all duration-500" :style="{ height: vh() }">
            <router-view v-slot="{ Component }">
                <FadeTransition>
                    <component :is="Component" />
                </FadeTransition>
            </router-view>
        </div>
    </div>
</template>
