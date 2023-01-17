import {defineStore} from "pinia";
import conversationsData from "../assets/data/conversations.json";
import achivedConversationsData from "../assets/data/archived.json";
import {computed, ref, Ref} from "vue";


export interface PreviewData {
    title: string, image?: string, description: string, domain: string, link: string,
};

export interface Attachment {
    id: number,
    type: string,
    name: string,
    size: string,
    url: string,
    thumbnail?: string,
};

export interface Recording {
    id: number,
    size: string,
    url: string,
    duration: string,
};

export interface Message {
    id: number,
    type?: string,
    content?: string | Recording,
    date: string,
    sender: string,
    replyTo?: number,
    previewData?: PreviewData,
    attachments?: Attachment[],
};

export interface Conversation {
    id: number,
    type: string,
    name?: string,
    avatar?: string,
    admins?: string[],
    contacts: string[],
    messages: Message[],
    pinnedMessage?: number,
    pinnedMessageHidden?: boolean,
};


export const useConversationsStore = defineStore('conversations', {
    state: () => {
        const conversations: Ref<Conversation[]> = ref(conversationsData.conversations); 
        const archivedConversations: Ref<Conversation[] | undefined> = ref(achivedConversationsData.conversations);

        const activeConversationId: Ref<number | null> = ref(null);
        const conversationOpen: Ref<string | undefined> = ref(undefined);
        return {
            conversations,
            archivedConversations,
            activeConversationId,
            conversationOpen,
        }
    },
    actions: {
    },
    getters: {
        isLoaded(state) {
            return true;
        },

        getConversationIndex: (state) => (conversationId: number) => {
            let conversationIndex;
        
            (state.conversations as Conversation[]).forEach((conversation, index) => {
                if (conversation.id === conversationId) {
                    conversationIndex = index;
                }
            });
        
            return conversationIndex;
        }
    }
})