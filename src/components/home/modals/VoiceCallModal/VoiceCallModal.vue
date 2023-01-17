<script setup lang="ts">
import { computed, ref } from "vue";

import { Call, useCallsStore } from "../../../../stores/calls";
import { getOtherMembers } from "../../../../utils";

import FadeTransition from "../../../reusables/transitions/FadeTransition.vue";
import Modal from "../Modal.vue";
import Dialing from "./Dialing.vue";
import Ongoing from "./Ongoing.vue";

const props = defineProps<{
    open: boolean,
    closeModal: (endCall: boolean) => void,
}>();

const calls = useCallsStore();

const members = computed(() => {
    return getOtherMembers((calls.activeCall as Call))
});

// determine the modal width based on the active component
const modalSize = ref('290px');

// the active modal component
const ActiveComponent = computed(() => {
    if (calls.activeCall) {
        if (calls?.activeCall.status === 'dialing') {
            modalSize.value = '290px'
            return Dialing;
        } else if (calls?.activeCall.status === 'ongoing') {
            modalSize.value = '400px'
            return Ongoing;
        }
    } else {
        return 'div';
    }
});

const handleCallStatusChange = (status: string) => {
    (calls.activeCall as Call).status = status;
};
</script>

<template>
    <Modal :open="props.open" :close-modal="() => props.closeModal(false)">
        <template v-slot:content>
            <div class="rounded bg-white dark:bg-gray-800 transition-all duration-300" :style="{'width': modalSize}">
                <FadeTransition>
                    <component :is="ActiveComponent" :members="members" :active-call="calls.activeCall"
                        :close-modal="() => props.closeModal(true)"
                        :handle-call-status-change="handleCallStatusChange" />
                </FadeTransition>
            </div>
        </template>
    </Modal>
</template>