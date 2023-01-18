<script setup lang="ts">
import { PencilSquareIcon } from "@heroicons/vue/24/outline";

import type { Ref } from "vue";
import { ref, watch, onMounted } from "vue";

import { useConversationsStore, Conversation as ConversationType } from "../../../../stores/conversations";
import { getName } from "../../../../utils";

import NoConversation from "../../../reusables/emptyStates/NoConversation.vue";
import IconButton from "../../../reusables/IconButton.vue";
import Loading1 from "../../../reusables/loading/Loading1.vue";
import SearchInput from "../../../reusables/SearchInput.vue";
import ComposeModal from "../../modals/ComposeModal/ComposeModal.vue";
import SidebarHeader from "../SidebarHeader.vue";
import ConversationsList from "./ConversationsList.vue";
import FadeTransition from "../../../reusables/transitions/FadeTransition.vue";
import { useChatStore } from "../../../../stores/chat";


const conversations = useConversationsStore();
const chat = useChatStore();

const searchText: Ref<string> = ref('');

const composeOpen = ref(false);

// the filterd list of conversations.
const filteredConversations: Ref<ConversationType[] | undefined> = ref(conversations.conversations);

// filter the list of conversation based on search text.
watch([searchText], () => {
    filteredConversations.value = conversations.conversations?.filter(
        (conversation) => getName(conversation)?.toLowerCase().includes(searchText.value.toLowerCase())
    );
});

// (event) switch between the rendered conversations.
const handleConversationChange = (conversationId: number) => {
    conversations.setCurrentActiveConversation(conversationId);
    conversations.setConversationOpen('open');
};

// (event) close the compose modal.
const closeComposeModal = () => {
    composeOpen.value = false;
};

onMounted(() => {
})
</script>

<template>
    <div>
        <SidebarHeader>
            <!--title-->
            <template v-slot:title>Messages</template>

            <!--side actions-->
            <template v-slot:actions>
                <IconButton @click="composeOpen = true" aria-label="compose conversation">
                    <PencilSquareIcon class="w-[20px] h-[20px] text-emerald-300 hover:text-emerald-400 " />
                </IconButton>
            </template>
        </SidebarHeader>

        <!--search bar-->
        <div class="px-5 xs:pb-6 md:pb-5">
            <SearchInput v-model="searchText" />
        </div>

        <!--conversations-->
        <div role="list" aria-label="conversations" class="w-full h-full scroll-smooth scrollbar-hidden"
            style="overflow-x:visible; overflow-y: scroll;">
            <Loading1 v-if="!conversations.isLoaded" v-for="item in 6" />

            <div v-else>
                <div
                    v-if="conversations.isLoaded && (filteredConversations as ConversationType[]).length > 0">

                    <FadeTransition>
                        <component :is="ConversationsList" :filtered-conversations="filteredConversations"
                            :active-id="(conversations.conf.activeConversationId as number)"
                            :handle-conversation-change="handleConversationChange"
                            :key="'active'" />
                    </FadeTransition>
                </div>

                <div v-else>
                    <NoConversation v-if="(filteredConversations as ConversationType[]).length === 0" />
                </div>
            </div>
        </div>

        <!--compose modal-->
        <ComposeModal :open="composeOpen" :close-modal="closeComposeModal" />
    </div>
</template>
