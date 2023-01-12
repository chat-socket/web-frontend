<script setup lang="ts">

import Typography from "../../reusables/Typography.vue";
import {useSettingsStore} from "../../../stores/settings";


const settings = useSettingsStore();
</script>

<template>
    <div class="flex flex-col  "
        :class="settings.isDarkMode ? ['bg-gray-900'] : ['animate-gradient bg-[length:200%_200%] bg-gradient-to-b from-[#B0B7F9] to-[#162CD4]']">
        <img src="../../../assets/logo-white.svg" class="w-[230px] h-[250px] opacity-70" />

        <Typography variant="display" :no-color="true" class="text-white opacity-70">Chat Socket</Typography>
    </div>
</template>
