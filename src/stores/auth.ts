import { defineStore } from "pinia";
import type { Ref } from "vue";
import { UserManager, WebStorageStateStore, User as OidcUser } from "oidc-client-ts";
import jwt_decode from "jwt-decode";
import { ref } from "vue";
import { USER } from "./fakeData";
import { useWebsocketStore } from "./websocket";

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    token: string;
    oidcUser: OidcUser;

    constructor(user: OidcUser) {
        this.id = user.profile.email!;
        this.firstName = user.profile.given_name!;
        this.lastName = user.profile.family_name!;
        this.email = user.profile.email!;
        this.avatar = user.profile.picture!;
        this.token = user.access_token;
        this.oidcUser = user;
    }

    expired() {
        return this.oidcUser.expired;
    }
};

const useAuthStore = defineStore("auth", {
    state: () => {
        const userStore = new WebStorageStateStore({ store: window.localStorage });
        const user: Ref<User | undefined> = ref(undefined);
        const websocket = useWebsocketStore();

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
            user.value = new User(newUser);
            websocket.connect(user.value.token);
          });

        userManager.getUser().then((oidcUser) => {
            if (oidcUser && !oidcUser.expired) {
                console.log("USER LOGGED IN");
                user.value = new User(oidcUser);
                websocket.connect(user.value.token);
            }
        });

        return {
            userManager,
            user
        }
    },

    actions: {
        login() {
            this.userManager.signinRedirect();
        },

        logout() {
            // Currently Spring authorization server hasn't supported OIDC Connect logout functionality yet
            // See: https://github.com/spring-projects/spring-authorization-server/issues/266
            // this.userManager.signoutRedirect();
            localStorage.clear();
            sessionStorage.clear();
            this.user = undefined;
            window.location.href = "/";
        }
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