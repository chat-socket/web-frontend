import { defineStore } from "pinia";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import { parseJSON } from "../utils";

export class LocalConfiguration {
    activeSidebarComponent: string = 'messages';
}


export const useChatStore = defineStore("chat", {

    state: () => {
        // local storage
        const storageChat = parseJSON(localStorage.getItem('chat'));
        const conf: Ref<LocalConfiguration> = ref(storageChat || new LocalConfiguration());

        return {
            conf,
        };

    },
    actions: {
        setCurrentActiveSidebarComponent(component: string) {
            this.conf.activeSidebarComponent = component;
            localStorage.setItem('chat', JSON.stringify(this.conf));
        }
    }
});
