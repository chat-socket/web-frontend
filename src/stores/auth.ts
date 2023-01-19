import { defineStore } from "pinia";
import type { Ref } from "vue";
import { UserManager, WebStorageStateStore, User as OidcUser } from "oidc-client-ts";
import jwt_decode from "jwt-decode";
import { ref } from "vue";
import { USER } from "./fakeData";

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    avatar: string,
    token: string
};

const useAuthStore = defineStore("auth", {
    state: () => {
        const userStore = new WebStorageStateStore({ store: window.localStorage });
        const user: Ref<User | undefined> = ref(USER);

        const configuration = {
            'authority': import.meta.env.VITE_OAUTH_ISSUER,
            'client_id': import.meta.env.VITE_OAUTH_CLIENT_ID,
            'redirect_uri': import.meta.env.VITE_OAUTH_REDIRECT_URI,
            'response_type': 'code',
            'automaticSilentRenew': true,
            'silent_redirect_uri': import.meta.env.VITE_OAUTH_SILENT_RENEW_URI,
            'monitorSession': true,
            'scope': import.meta.env.VITE_OAUTH_SCOPE,
            'post_logout_redirect_uri': '/',
            'loadUserInfo': true
        }
        localStorage.setItem('oauthConf', JSON.stringify(configuration));
        const userManager = new UserManager({'userStore': userStore, ...configuration});

        userManager.events.addUserLoaded(newUser => {
            console.log("USER LOADED EVENT");
            userManager.storeUser(newUser);
          });

        userManager.getUser().then((oidcUser) => {
            if (oidcUser && !oidcUser.expired) {
                // user.value = {email: oidcUser.profile.email!}
                console.log("USER LOGGED IN");
                console.log(oidcUser);
            }
        });
        userManager.events.addSilentRenewError(error => {
            console.log("ERROR RENEWING ACCESS TOKEN.");
            console.log(error);
        })

        return {
            userManager,
            user
        }
    },

    actions: {
        login() {
            this.userManager.signinRedirect();
        },
    },

    getters: {
        getOtherMembers: (state) => (members: string[]) => {
            let otherMembers = [];
            for (let member of members) {
                if (member !== (state.user as User).id) {
                    otherMembers.push(member);
                }
            }
            return otherMembers;
        }
    }
});

export default useAuthStore;