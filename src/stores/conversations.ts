import {defineStore} from "pinia";
import conversationsData from "../assets/data/conversations.json";
import achivedConversationsData from "../assets/data/archived.json";
import {computed, ref, Ref} from "vue";
import { plainToInstance, Type } from "class-transformer";
import { getFullName, parseJSON, sleep } from "../utils";
import { useContactsStore } from "./contacts";
import useAuthStore from "./auth";


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
    status!: string;
    admins?: string[];
    contacts!: string[];

    @Type(() => Date)
    lastSeen!: Date[];
    messages!: Message[];
};

export class LocalConfiguration {
    activeConversationId: number | undefined;
    conversationOpen: string | undefined;
}


export const useConversationsStore = defineStore('conversations', {
    state: () => {
        const storageConversations = parseJSON(localStorage.getItem('conversations'));
        const conf: Ref<LocalConfiguration> = ref(storageConversations || new LocalConfiguration());

        const conversations: Ref<Conversation[]> = ref([]); 
        const loading: Ref<boolean> = ref(false);
        const conversationsFetched: Ref<boolean> = ref(false);
        const activeConversation: Ref<Conversation | undefined> = ref(undefined);
        const contacts = useContactsStore();
        contacts.fetchContacts();
        const auth = useAuthStore();
        
        return {
            loading,    
            conf,
            contacts,
            auth,
            conversationsFetched,
            activeConversation,
            conversations,
        }
    },
    actions: {
        async fetchConversations(isAchived: boolean) {
            this.loading = true;
            this.conversationsFetched = false;
            await sleep(500);
            if (isAchived) {
                this.conversations = plainToInstance(Conversation,  achivedConversationsData.conversations);
            } else {
                this.conversations = plainToInstance(Conversation,  conversationsData.conversations)
            }
            this.conversationsFetched = true;
            this.loading = false;
        },

        setCurrentActiveConversation(conversation: Conversation) {
            this.conf.activeConversationId = conversation.id;
            this.activeConversation = conversation;
            localStorage.setItem('conversations', JSON.stringify(this.conf));
        },

        setConversationOpen(open: string) {
            this.conf.conversationOpen = open;
            localStorage.setItem('conversations', JSON.stringify(this.conf));
        }
    },
    getters: {
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
        },

        isFetched: (state) => () => {
            return state.conversationsFetched && state.contacts.isFetched;
        },

        getAvatar: (state) => (conversation: Conversation) => {
            if (['group', 'broadcast'].includes((conversation as Conversation).type)) {
                return conversation?.avatar;
            } else {
                const oddContacts = state.auth.getOtherMembers(conversation.contacts);
                return state.contacts.getContact(oddContacts[0])?.avatar
            }
        },

        getName: (state) => (conversation: Conversation) => {
            if (['group', 'broadcast'].includes((conversation as Conversation).type)) {
                return conversation?.name;
            } else {
                const oddContacts = state.auth.getOtherMembers(conversation.contacts);
                return getFullName(state.contacts.getContact(oddContacts[0])!);
            }
        }
    }
})