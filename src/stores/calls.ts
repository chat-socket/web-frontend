import {defineStore} from "pinia";
import callsData from "../assets/data/calls.json";
import activeCallData from "../assets/data/active_call.json"
import {computed, ref, Ref} from "vue";
import { useContactsStore } from "./contacts";
import { getFullName, shortenText } from "../utils";
import useAuthStore from "./auth";


export interface Call {
    type: string,
    direction: string,
    status: string,
    date: string,
    length: string,
    members: string[],
    admins: string[],
};

export const useCallsStore = defineStore('calls', {
    state: () => {
        const calls: Ref<Call[]> = ref(callsData.calls);
        const activeCall: Ref<Call | undefined> = ref(activeCallData);
        const contacts = useContactsStore();
        contacts.fetchContacts();
        const auth = useAuthStore();
        const callMinimized = ref(false);
        const openVoiceCall = ref(false);
        return {
            calls,
            auth,
            contacts,
            activeCall,
            callMinimized,
            openVoiceCall
        }
    },
    actions: {
        endCurrentCall() {
            this.activeCall = undefined;
            this.callMinimized = false;
        }
    },
    getters: {
        isLoaded(state) {
            return true;
        },

        getCallName: (state) => (call: Call, full?: boolean, maxLength: number = 20) => {
            const callNames: string[] = [];
            const members = state.auth.getOtherMembers(call.members);
            for (let member of members) {
                callNames.push(getFullName(state.contacts.getContact(member)!))
            }
        
            if (full) {
                return callNames.join(', ');
            } else {
                return shortenText(callNames.join(', '), maxLength);
            }
        }
    }
})