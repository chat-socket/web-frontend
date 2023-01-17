import {defineStore} from "pinia";
import callsData from "../assets/data/calls.json";
import activeCallData from "../assets/data/active_call.json"
import {computed, ref, Ref} from "vue";


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

        const callMinimized = ref(false);
        const openVoiceCall = ref(false);
        return {
            calls,
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
        }
    }
})