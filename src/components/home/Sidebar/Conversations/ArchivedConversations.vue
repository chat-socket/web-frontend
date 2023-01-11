<script setup lang="ts">
import useChatStore, { Conversation as ConversationType } from "../../../../stores/chat";

import Loading1 from "../../../reusables/loading/Loading1.vue";
import SidebarHeader from "../SidebarHeader.vue";
import SearchInput from "../../../reusables/SearchInput.vue";
import { Ref, ref, watch } from "vue";
import FadeTransition from "../../../reusables/transitions/FadeTransition.vue";
import ConversationsList from "./ConversationsList.vue";
import NoConversation from "../../../reusables/emptyStates/NoConversation.vue";
import { getName } from "../../../../utils";

const chat = useChatStore();
const searchText: Ref<string> = ref('');

// (event) switch between the rendered conversations.
const handleConversationChange = (conversationId: number) => {
    chat.activeConversationId = conversationId;
    chat.conversationOpen = 'open';
};

// the filterd list of conversations.
const filteredConversations: Ref<ConversationType[] | undefined> = ref(chat.archivedConversations);

watch([searchText], () => {
    filteredConversations.value = chat.archivedConversations?.filter((conversation) => getName(conversation)?.toLowerCase().includes(searchText.value.toLowerCase()));
});
</script>

<template>
    <div>
        <SidebarHeader>
            <template v-slot:title>Archieved Conversations</template>
        </SidebarHeader>

        <!--search bar-->
        <div class="px-5 xs:pb-6 md:pb-5">
            <SearchInput v-model="searchText" />
        </div>

        <!--conversations-->
        <div role="list" aria-label="conversations" class="w-full h-full scroll-smooth scrollbar-hidden"
            style="overflow-x:visible; overflow-y: scroll;">
            <Loading1 v-if="chat.status === 'loading'  || chat.delayLoading" v-for="item in 6" />

            <div v-else>
                <div
                    v-if="chat.status === 'success' && !chat.delayLoading && (filteredConversations as ConversationType[]).length > 0">

                    <FadeTransition>
                        <component :is="ConversationsList" :filtered-conversations="filteredConversations"
                            :active-id="(chat.activeConversationId as number)"
                            :handle-conversation-change="handleConversationChange"
                            :key="'archive'" />
                    </FadeTransition>
                </div>

                <div v-else>
                    <NoConversation v-if="(filteredConversations as ConversationType[]).length === 0" />
                </div>
            </div>
        </div>
    </div>
</template>