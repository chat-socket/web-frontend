<script setup lang="ts">
import { useConversationsStore, Conversation as ConversationType, Conversation } from "../../../../stores/conversations";

import Loading1 from "../../../reusables/loading/Loading1.vue";
import SidebarHeader from "../SidebarHeader.vue";
import SearchInput from "../../../reusables/SearchInput.vue";
import { computed, Ref, ref, watch } from "vue";
import FadeTransition from "../../../reusables/transitions/FadeTransition.vue";
import ConversationsList from "./ConversationsList.vue";
import NoConversation from "../../../reusables/emptyStates/NoConversation.vue";

const conversations = useConversationsStore();
conversations.fetchConversations(true);
const searchText: Ref<string> = ref('');

// (event) switch between the rendered conversations.
const handleConversationChange = (conversation: Conversation) => {
    conversations.setCurrentActiveConversation(conversation);
    conversations.setConversationOpen('open');
};

const filteredConversations = computed(() => {
    return conversations.conversations!.filter(
        (conversation) => conversations.getName(conversation)?.toLowerCase().includes(searchText.value.toLowerCase())
    );
})

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
            <Loading1 v-if="conversations.loading" />

            <div v-if="!conversations.loading && conversations.isFetched() && filteredConversations!.length > 0">

                <FadeTransition>
                    <component :is="ConversationsList" :filtered-conversations="filteredConversations"
                        :active-id="(conversations.conf.activeConversationId as number)"
                        :handle-conversation-change="handleConversationChange"
                        :key="'archive'" />
                </FadeTransition>
            </div>

            <div v-if="!conversations.loading && conversations.isFetched() && filteredConversations!.length === 0">
                <NoConversation />
            </div>
        </div>
    </div>
</template>