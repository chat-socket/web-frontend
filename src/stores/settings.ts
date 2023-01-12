import {defineStore} from "pinia";
import { DefaultSettings } from "./defaultData";
import {ref, Ref} from "vue";


export interface Setting {
    id: number,
    type: string,
    value?: boolean | string | File,
    title: string,
    description?: string,
}

export interface Settings {
    id: number,
    title: string,
    description?: string,
    settings: Setting[],
}

export const useSettingsStore = defineStore('settings', {
    state: () => {
        const storageSettings = JSON.parse(localStorage.getItem('settings') || '{}');
        const settings: Ref<Settings[]> = ref(storageSettings || DefaultSettings) // not fetched

        return {
            preferences: settings
        }
    },
    actions: {
        switchTheme() {
            this.preferences[2].settings[0].value = !this.preferences[2].settings[0].value;
            localStorage.setItem('settings', JSON.stringify(this.preferences));
        },

        update(groupId: number, settingId: number, value: boolean | string | File) {
            for (const settings of this.preferences) {
                if (settings.id === groupId) {
                    for (const setting of settings.settings) {
                        if (setting.id == settingId) {
                            setting.value = value;
                        }
                    }
                }
            }
            localStorage.setItem('settings', JSON.stringify(this.preferences));
        }
    },
    getters: {
        isDarkMode(state) {
            return state.preferences[2].settings[0].value;
        }
    }
})