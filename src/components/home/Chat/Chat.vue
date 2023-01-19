<script setup lang="ts">
import { computed } from "vue";

import { useConversationsStore } from "../../../stores/conversations";

import loading3 from "../../reusables/loading/loading3.vue";
import NoChatSelected from "../../reusables/emptyStates/NoChatSelected.vue";
import SelectedChat from "./SelectedChat.vue";


const conversations = useConversationsStore();

// the active chat component or loading component.
const activeChatComponent = computed(() => {
    if (conversations.loading)
        return loading3;
    else if (conversations.conversationsFetched && conversations.activeConversation)
        return SelectedChat;
    else if (conversations.conversationsFetched && !conversations.loading)
        return NoChatSelected;
});


</script>

<template>
    <div id="mainContent"
        class="xs:absolute xs:z-10 md:static grow h-full xs:w-full md:w-fit scrollbar-hidden bg-white dark:bg-gray-800 transition-all duration-500"
        :class="conversations.conf.conversationOpen === 'open' ? ['xs:left-[0px]','xs:static'] : ['xs:left-[1000px]']" role="region">
        <Transition name="fade" mode="out-in">
            <component :is="activeChatComponent" :active-conversation="conversations.activeConversation"
                :key="conversations.activeConversation?.id" />
        </Transition>
    </div>
</template>

<style scoped>
@media only screen and (min-width: 969px) {

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease-in;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
}
</style>