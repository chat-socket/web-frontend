<script setup lang="ts">
import { computed } from "vue";

import { useChatStore } from "../../../stores/chat";

import FadeTransition from "../../reusables/transitions/FadeTransition.vue";
import Contacts from "./Contacts/Contacts.vue";
import Conversations from "./Conversations/Conversations.vue";
import ArchivedConversations from "./Conversations/ArchivedConversations.vue";
import Calls from "./Calls/Calls.vue";
import Settings from "./Settings/Settings.vue";

const chat = useChatStore();

// the selected sidebar component (e.g message/notifications/settings)
const ActiveComponent = computed(() => {
    if (chat.conf.activeSidebarComponent === 'messages') {
        return Conversations;
    } else if (chat.conf.activeSidebarComponent === 'contacts') {
        return Contacts;
    } else if (chat.conf.activeSidebarComponent === 'archived_conversations') {
        return ArchivedConversations;
    } else if (chat.conf.activeSidebarComponent === 'phone') {
        return Calls;
    } else if (chat.conf.activeSidebarComponent === 'settings') {
        return Settings;
    }
});
</script>

<template>
    <aside
        class="xs:w-full md:w-[320px] h-full xs:px-5 md:p-0 flex flex-col overflow-visible transition-all duration-500">
        <FadeTransition>
            <component :is="ActiveComponent" class="h-full flex flex-col" />
        </FadeTransition>
    </aside>
</template>
