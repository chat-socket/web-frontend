<script setup lang="ts">
import { ChatBubbleOvalLeftIcon, Cog6ToothIcon, MoonIcon, PhoneIcon, SunIcon, UserIcon } from "@heroicons/vue/24/solid";
import { ArchiveBoxIcon} from "@heroicons/vue/24/outline";
import { ref } from "vue";


import useAuthStore from "../../../stores/auth";
import { useChatStore } from "../../../stores/chat";

import NavLink from "./NavLink.vue";
import ProfileDropdown from "./ProfileDropdown.vue";
import { useSettingsStore } from "../../../stores/settings";

const auth = useAuthStore();
const chat = useChatStore();
const settings = useSettingsStore();

const showDropdown = ref(false);

let SkipLinkFocused = ref(false);

// (event) change the active sidebar component when clicking on a NavLink
const handleActiveSidebarComponentChange = (value: string) => {
    chat.setCurrentActiveSidebarComponent(value);
};
</script>

<template>
    <div
        class="xs:w-full md:w-11 md:h-full md:py-7 xs:py-5 px-5 flex xs:flex-row md:flex-col  items-center  transition-all duration-500">

        <!--main navigation-->
        <div class="grow">
            <nav aria-label="Main navigation">
                <ul class="xs:flex md:block xs:justify-between xs:items-center">
                    <!--message button-->
                    <li>
                        <NavLink :icon="ChatBubbleOvalLeftIcon" title="Conversations" :notifications="3"
                            @click="() => handleActiveSidebarComponentChange('messages')"
                            :active="chat.conf.activeSidebarComponent === 'messages'" />
                    </li>

                    <!--notifications button-->
                    <li class="xs:hidden md:inline">
                        <NavLink :icon="ArchiveBoxIcon" title="Archived Conversations" 
                            @click="()=>handleActiveSidebarComponentChange('archived_conversations')"
                            :active="chat.conf.activeSidebarComponent === 'archived_conversations'" />
                    </li>
                    
                    <!--contacts list button-->
                    <li>
                        <NavLink :icon="UserIcon" title="Contacts"
                            @click="()=>handleActiveSidebarComponentChange('contacts')"
                            :active="chat.conf.activeSidebarComponent === 'contacts'" />
                    </li>

                    <!--dropdown button small screen-->
                    <li>
                        <div class="relative xs:block md:hidden">
                            <button id="small-profile-menu-button" @click="showDropdown = !showDropdown"
                                class="bg-white rounded-full active:scale-110 focus:outline-none focus:scale-110 transition duration-200 ease-out"
                                :style="{'box-shadow': !settings.isDarkMode ? '0 2px 5px rgba(193, 202, 255, 0.5),2px 0 5px rgba(193, 202, 255, 0.5),-2px 0 5px rgba(193, 202, 255, 0.5),0 -2px 5px rgba(193, 202, 255, 0.5)': 'none'}"
                                :aria-expanded="showDropdown" aria-controls="profile-menu"
                                aria-label="toggle profile menu">
                                <div id="user-avatar" :style="{ backgroundImage: `url(${auth.user?.avatar})`}"
                                    class="w-7 h-7 rounded-full bg-cover bg-center">
                                </div>
                            </button>

                            <ProfileDropdown id="small-profile-menu" aria-labelledby="small-profile-menu-button"
                                :show-dropdown="showDropdown" :handleCloseDropdown="() => showDropdown = false" />
                        </div>
                    </li>

                    <!--voice call button-->
                    <li>
                        <NavLink :icon="PhoneIcon" title="Call log" :notifications="1"
                            @click="()=>handleActiveSidebarComponentChange('phone')"
                            :active="chat.conf.activeSidebarComponent === 'phone'" />
                    </li>

                    <!--settings button small screen-->
                    <li class="xs:inline md:hidden">
                        <NavLink :icon="Cog6ToothIcon" title="Settings"
                            @click="()=>handleActiveSidebarComponentChange('settings')"
                            :active="chat.conf.activeSidebarComponent === 'settings'" />
                    </li>
                </ul>
            </nav>
        </div>

        <!--secondary navigation-->
        <div>
            <nav aria-label="Extra navigation" class="xs:hidden md:block">
                <ul>
                    <!--toggle dark mode button-->
                    <li>
                        <NavLink :icon="settings.isDarkMode ? SunIcon : MoonIcon" title="Night mode"
                            @click="settings.switchTheme()" />
                    </li>
                    <!--settings button-->
                    <li>
                        <NavLink :icon="Cog6ToothIcon" title="Settings"
                            @click="()=>handleActiveSidebarComponentChange('settings')"
                            :active="chat.conf.activeSidebarComponent === 'settings'" />
                    </li>
                </ul>
            </nav>

            <!--seperator-->
            <hr class="xs:hidden md:block mb-6 border-gray-100 dark:border-gray-600" />

            <!--user avatar-->
            <div class="relative xs:hidden md:block">
                <!--dropdown button-->
                <button id="profile-menu-button" @click="showDropdown = !showDropdown"
                    class="bg-white rounded-full active:scale-110 focus:outline-none focus:scale-110 transition duration-200 ease-out"
                    :style="{'box-shadow': !settings.isDarkMode ? '0 2px 5px rgba(193, 202, 255, 0.5),2px 0 5px rgba(193, 202, 255, 0.5),-2px 0 5px rgba(193, 202, 255, 0.5),0 -2px 5px rgba(193, 202, 255, 0.5)': 'none'}"
                    :aria-expanded="showDropdown" aria-controls="profile-menu" aria-label="toggle profile menu">
                    <div id="user-avatar" :style="{ backgroundImage: `url(${auth.user?.avatar})`}"
                        class="w-7 h-7 rounded-full bg-cover bg-center">
                    </div>
                </button>

                <ProfileDropdown id="profile-menu" aria-labelledby="profile-menu-button" :show-dropdown="showDropdown"
                    :handleCloseDropdown="() => showDropdown = false" />
            </div>
        </div>
    </div>
</template>
