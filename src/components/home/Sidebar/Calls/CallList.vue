<script setup lang="ts">
import { Call as CallType } from "../../../../stores/calls";

import Call from "./Call.vue";

const props = defineProps<{
    calls: CallType[]
    openInfoModal: (call: CallType) => void,
}>();
</script>

<template>
    <div>
        <Call v-for="call in props.calls" :call="call" :open-info-modal="props.openInfoModal" />
    </div>
</template>