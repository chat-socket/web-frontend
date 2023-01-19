<script setup lang="ts">
import { ChevronLeftIcon, EllipsisVerticalIcon, InformationCircleIcon, MagnifyingGlassIcon, NoSymbolIcon, PhoneIcon, ScaleIcon, ShareIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";

import { Conversation, useConversationsStore } from "../../../../stores/conversations";
import { Call, useCallsStore } from "../../../../stores/calls";

import Dropdown from "../../../reusables/Dropdown.vue";
import DropdownLink from "../../../reusables/DropdownLink.vue";
import IconButton from "../../../reusables/IconButton.vue";
import Typography from "../../../reusables/Typography.vue";
import ConversationInfoModal from "../../modals/ConversationInfoModal/ConversationInfoModal.vue";
import SearchModal from "../../modals/SearchModal.vue";
import VoiceCallModal from "../../modals/VoiceCallModal/VoiceCallModal.vue";
import { ACTIVECALL } from "../../../../stores/fakeData";
import { useContactsStore } from "../../../../stores/contacts";

const props = defineProps<{
    activeConversation?: Conversation,
}>();

const conversations = useConversationsStore();
const calls = useCallsStore();
const contacts = useContactsStore();

const showDropdown = ref(false);

const openSearch = ref(false);

const openInfo = ref(false);

// (event) close dropdown menu when click item
const handleCloseDropdown = () => {
    showDropdown.value = false;
};

// (event) close dropdown menu when clicking outside the menu.
const handleClickOutside = (event: Event) => {
    let target = event.target as HTMLElement;
    let parentElement = target.parentElement as HTMLElement;

    if ((target && !(target.classList as Element["classList"]).contains('open-top-menu'))
        && (parentElement && !(parentElement.classList as Element["classList"]).contains('open-top-menu'))) {
        handleCloseDropdown();
    }
};

// (event) close the selected conversation
const handleCloseConversation = () => {
    conversations.setConversationOpen('close');
};

// (event) open the voice call modal and expand call
const handleOpenVoiceCallModal = () => {
    calls.activeCall = ACTIVECALL;
    calls.callMinimized = false;

    // wait for the transition to ongoing status to end
    setTimeout(() => {
        calls.openVoiceCall = true;
    }, 300)
};

// (event) close the voice call modal and minimize the call
const handleCloseVoiceCallModal = (endCall: boolean) => {
    if (endCall) {
        calls.activeCall = undefined;
        calls.callMinimized = false;
    }

    if (calls.openVoiceCall) {
        calls.openVoiceCall = false;
        calls.callMinimized = true;
    }
};
</script>

<template>
    <div>
        <!--Top section-->
        <div class="w-full px-5 py-6 flex justify-center items-center" v-if="!contacts.loading && contacts.isFetched">
            <!--back button-->
            <div class="group mr-4 md:hidden">
                <IconButton class="w-7 h-7" @click="handleCloseConversation">
                    <ChevronLeftIcon aria-label="close conversation"
                        class="w-[20px] h-[20px] text-gray-300 group-hover:text-emerald-300" />
                </IconButton>
            </div>

            <div v-if="!conversations.loading && conversations.isFetched() && conversations.activeConversation" class="flex grow">
                <!--avatar-->
                <button class="mr-5 outline-none" @click="() => openInfo = true" aria-label="profile avatar">
                    <div :style="{ backgroundImage: `url(${conversations.getAvatar(activeConversation!)})`}"
                        class="w-[36px] h-[36px] rounded-full bg-cover bg-center">
                    </div>
                </button>

                <!--name and last seen-->
                <div class="flex flex-col">
                    <Typography variant="heading-2" @click="() => openInfo = true" class="mb-2 outline cursor-pointer"
                        tabindex="0">
                        {{conversations.getName(activeConversation!)}}
                    </Typography>

                    <Typography variant="body-2" class="font-extralight" tabindex="0"
                        aria-label="Last seen december 16, 2019">
                        Last seen Dec 16, 2019
                    </Typography>
                </div>
            </div>

            <div class="flex" :class="{'hidden': conversations.loading && !conversations.isFetched()}">
                <!--search button-->
                <IconButton @click="openSearch = true" aria-label="Search messages" class="group w-7 h-7 mr-3">
                    <MagnifyingGlassIcon class="w-[20px] h-[20px] text-gray-300 group-hover:text-emerald-300" />
                </IconButton>

                <div class="relative">
                    <!--dropdown menu button-->
                    <IconButton id="open-conversation-menu" @click="showDropdown = !showDropdown" tabindex="0"
                        class="open-top-menu group w-7 h-7" :aria-expanded="showDropdown"
                        aria-controls="conversation-menu" aria-label="toggle conversation menu">
                        <EllipsisVerticalIcon
                            class="open-top-menu w-[20px] h-[20px] text-gray-300 group-hover:text-emerald-300" />
                    </IconButton>

                    <!--dropdown menu-->
                    <Dropdown id="conversation-menu" :close-dropdown="() => showDropdown = false" :show="showDropdown"
                        :position="['right-0']" :handle-click-outside="handleClickOutside"
                        aria-labelledby="open-conversation-menu">
                        <DropdownLink :handle-click="handleCloseDropdown">
                            <InformationCircleIcon
                                class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
                            Profile Information
                        </DropdownLink>

                        <DropdownLink :handle-click="()=>{handleCloseDropdown(); handleOpenVoiceCallModal()}">
                            <PhoneIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
                            Voice call
                        </DropdownLink>

                        <DropdownLink :handle-click="handleCloseDropdown">
                            <ShareIcon class="h-5 w-5 mr-3 text-black opacity-60 dark:text-white dark:opacity-70" />
                            Shared media
                        </DropdownLink>


                        <DropdownLink :handle-click="handleCloseDropdown"
                            class="text-red-500 hover:bg-red-100 active:bg-red-100 dark:text-red-500">
                            <NoSymbolIcon class="h-5 w-5 mr-3 text-red-500 " />
                            Block contact
                        </DropdownLink>
                    </Dropdown>
                </div>
            </div>
        </div>

        <!--Search modal-->
        <SearchModal :open="openSearch" :close-modal="() => openSearch = false"
            :conversation="(props.activeConversation as Conversation)" />

        <!--Contact info modal-->
        <ConversationInfoModal :open="openInfo" :closeModal="() => openInfo = false"
            :conversation="(props.activeConversation as Conversation)"/>

        <!--voice call modal-->
        <VoiceCallModal :open="calls.openVoiceCall" :close-modal="handleCloseVoiceCallModal" />
    </div>
</template>