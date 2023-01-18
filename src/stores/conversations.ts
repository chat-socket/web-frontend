import {defineStore} from "pinia";
import conversationsData from "../assets/data/conversations.json";
import achivedConversationsData from "../assets/data/archived.json";
import {computed, ref, Ref} from "vue";
import { plainToInstance, Type } from "class-transformer";
import { parseJSON } from "../utils";


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

export class Message {
    id!: number;
    type?: string;
    content?: string | Recording;

    @Type(() => Date)
    date!: Date;
    sender!: string;
    replyTo?: number;
    previewData?: PreviewData;
    attachments?: Attachment[];
};

export class Conversation {
    id!: number;
    type!: string;
    name?: string;
    avatar?: string;
    admins?: string[];
    contacts!: string[];
    messages!: Message[];
    pinnedMessage?: number;
    pinnedMessageHidden?: boolean;
};

export class LocalConfiguration {
    activeConversationId: number | undefined;
    conversationOpen: string | undefined;
}


export const useConversationsStore = defineStore('conversations', {
    state: () => {
        const storageConversations = parseJSON(localStorage.getItem('conversations'));
        const conf: Ref<LocalConfiguration> = ref(storageConversations || new LocalConfiguration());

        const conversations: Ref<Conversation[]> = ref(plainToInstance(Conversation,  conversationsData.conversations)); 
        const archivedConversations: Ref<Conversation[] | undefined> = ref(plainToInstance(Conversation,  achivedConversationsData.conversations));

        
        return {
            conf,
            conversations,
            archivedConversations,
        }
    },
    actions: {
        setCurrentActiveConversation(conversationId: number) {
            this.conf.activeConversationId = conversationId;
            localStorage.setItem('conversations', JSON.stringify(this.conf));
        },

        setConversationOpen(open: string) {
            this.conf.conversationOpen = open;
            localStorage.setItem('conversations', JSON.stringify(this.conf));
        }
    },
    getters: {
        isLoaded(state) {
            return true;
        },

        getMessage: (state) => (conversation: Conversation, messageId?: number) => {
            // Should be fetched from server
            // Because the message that is being replied may not be fetched yet
            if (!messageId) {
                return undefined;
            }
            for (const message of conversation.messages) {
                if (message.id === messageId) {
                    return message;
                }
            }
            return undefined;
        }
    }
})