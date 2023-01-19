<script setup lang="ts">
import moment from "moment";
import type { Ref } from "vue";
import { onMounted, provide, ref, computed } from "vue";

import useAuthStore, { User } from "../../../../stores/auth";
import { useConversationsStore, Conversation, Message as MessageType } from "../../../../stores/conversations";
import MessageBubble from "./MessageBubble.vue";
import TimelineDivider from "./TimelineDivider.vue";

const props = defineProps<{
    activeConversation?: Conversation,
    selectMessageToReplyTo: (message?: MessageType) => void
}>();

const auth = useAuthStore();
const conversations = useConversationsStore();

const container: Ref<HTMLElement | null> = ref(null);

class MessageInfo {
    useDivider: boolean[] = [];
    dateDivider: string[] = [];
    isFollowUp: boolean[] = [];
}

const messageInfo = computed(() => {
    const result: MessageInfo = new MessageInfo();
    for (let i = 0; i < props.activeConversation!.messages.length; i++) { 
        const currentMessage = props.activeConversation!.messages[i];
        const currentMoment = moment(currentMessage.date);
        if (i == 0) {
            result.useDivider.push(false);
            result.isFollowUp.push(false);
            result.dateDivider.push('');    // Will be ignored anyway
        } else {
            const prevMessage = props.activeConversation!.messages[i - 1];
            const preMoment = moment(prevMessage.date);
            const dateDiff = Math.ceil(currentMoment.clone().endOf('day').diff(preMoment, 'days', true));
            result.useDivider.push(dateDiff > 1);
            result.isFollowUp.push(currentMessage.sender === prevMessage.sender);
            result.dateDivider.push(currentMoment.calendar({ 
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'DD/MM/YYYY'
            }));
        }
    }
    return result;
});

// checks whether the message is sent by the authenticated user.
const isSelf = (message: MessageType): boolean => {
    return message.sender === (auth.user as User).id
};

// scroll messages to bottom.
onMounted(() => {
    (container.value as HTMLElement).scrollTop = (container.value as HTMLElement).scrollHeight;
});

// provide the active conversation to all children
provide('activeConversaion', props.activeConversation);
</script>

<template>
    <div ref="container" class="grow px-5 py-5 flex flex-col overflow-y-scroll scrollbar-hidden">
        <div v-if="!conversations.loading && conversations.isFetched()"
            v-for="(message, index) in (props.activeConversation as Conversation).messages" :key="message.id">
            <TimelineDivider v-if="messageInfo.useDivider[index]" :date="messageInfo.dateDivider[index]" />

            <MessageBubble :message="message" :self="isSelf(message)" :follow-up="messageInfo.isFollowUp[index]"
                :divider="messageInfo.useDivider[index]" :select-message-to-reply-to="props.selectMessageToReplyTo"
                :reply-to-message="conversations.getMessage(props.activeConversation!, message.replyTo)" />
        </div>
    </div>
</template>
