import { defineStore } from "pinia";
import type { Ref } from "vue";
import { computed, ref } from "vue";


export const useChatStore = defineStore("chat", {

    state: () => {
        // local storage
        const storage = JSON.parse(localStorage.getItem('chat') || '{}');


        // ui refs
        const activeSidebarComponent: Ref<string> = ref(storage.activeSidebarComponent || 'messages');

        return {

            // ui refs
            activeSidebarComponent,
        };

    }
});
