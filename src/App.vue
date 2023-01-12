<script setup lang="ts">
import { computed } from "vue";

import useChatStore from './stores/chat';

import FadeTransition from './components/reusables/transitions/FadeTransition.vue';
import useAuthStore from "./stores/auth";
import {useSettingsStore} from "./stores/settings";

const chat = useChatStore();
const auth = useAuthStore();
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
