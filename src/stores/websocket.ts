import { defineStore } from "pinia";
import { ref, Ref } from "vue";
import WebSocketWrapper from "ws-wrapper";


export const useWebsocketStore = defineStore('websocket', {
    state: () => {
        const isConnected: Ref<boolean> = ref(false);
        const client = new WebSocketWrapper(null, {
            "requestTimeout": 30 * 1000,
            "debug": true
        });

        client.autoReconnect = true;

        client.on('connect', function () {
            isConnected.value = true;
        })

        client.on('disconnect', function () {
            isConnected.value = false;
        })

        return {
            client,
            isConnected
        }
    },
    actions: {
        async connect(accessToken: string) {
            if (!this.isConnected) {
                this.client.bind(new WebSocket(
                    import.meta.env.VITE_WS_ENDPOINT, ['access_token', 'Bearer ' + accessToken]));
            }
        },

        subscribe(destination: string, callback: any) {
            if (this.isConnected) {
                this.client.of(destination).on("message", callback)
            } else {
                throw new Error("Can't connect");
            }
        }
    },
    getters: {
    }
})