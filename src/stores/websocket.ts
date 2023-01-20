import { defineStore } from "pinia";
import { computed, ref, Ref } from "vue";
import { Client, messageCallbackType, StompSubscription } from '@stomp/stompjs';


export class WsSubcription {
    destination!: string;
    callback!: messageCallbackType;
    subscription!: StompSubscription;

    constructor(destination: string, callback: messageCallbackType, subscription: StompSubscription) {
        this.destination = destination;
        this.callback = callback;
        this.subscription = subscription;
    }
}


export const useWebsocketStore = defineStore('websocket', {
    state: () => {
        const isConnected: Ref<boolean> = ref(false);
        const subcriptions: WsSubcription[] = [];

        const client = new Client({
            brokerURL: import.meta.env.VITE_WS_ENDPOINT,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 500,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = function() {
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect
            isConnected.value = true;
            console.log("Connected to websocket !");
            for (const subcription of subcriptions) {
                console.log('Re-subcribing ' + subcription.destination);
                subcription.subscription = client.subscribe(subcription.destination, subcription.callback);
            }
        };
        
        client.onStompError = function (frame) {
            // Will be invoked in case of error encountered at Broker
            // Bad login/passcode typically will cause an error
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
            isConnected.value = false;
          };

        const stormClient = ref(client);

        return {
            subcriptions,
            stormClient,
            isConnected
        }
    },
    actions: {
        async connect(accessToken: string) {
            if (!this.isConnected) {
                this.stormClient.connectHeaders = {
                    Authorization: 'Bearer ' + accessToken,
                }
                this.stormClient.activate();
            }
        },

        subcribe(destination: string, callback: messageCallbackType) {
            if (this.isConnected) {
                const subscription = this.stormClient.subscribe(destination, callback);
                this.subcriptions.push(new WsSubcription(destination, callback, subscription));
                return subscription;
            } else {
                throw new Error("Can't connect");
            }
        }
    },
    getters: {
    }
})