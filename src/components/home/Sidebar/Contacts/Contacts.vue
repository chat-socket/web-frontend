<script setup lang="ts">
import { UserPlusIcon } from "@heroicons/vue/24/outline";
import type { Ref } from "vue";
import { ref, watch } from "vue";

import { useContactsStore, Contact, ContactGroup } from "../../../../stores/contacts";

import IconButton from "../../../reusables/IconButton.vue";
import Loading2 from "../../../reusables/loading/Loading2.vue";
import SearchInput from "../../../reusables/SearchInput.vue";
import AddContactModal from "../../modals/AddContactModal.vue";
import SidebarHeader from "../SidebarHeader.vue";
import ContactGroups from "./ContactGroups.vue";
import NoContacts from "../../../reusables/emptyStates/NoContacts.vue";

const contacts = useContactsStore();

const searchText: Ref<string> = ref('');

const openModal = ref(false);

// html element containing the contact groups
const contactContainer: Ref<HTMLElement | null> = ref(null);

// contact groups filtered by search text
const filteredContactGroups: Ref<ContactGroup[] | undefined> = ref(contacts.contactGroups);

// update the filtered contact groups based on the searchtext
watch(searchText, () => {
    filteredContactGroups.value = contacts.contactGroups?.map((group) => {
        let newGroup = { ...group };

        newGroup.contacts = newGroup.contacts.filter((contact) => {
            if (contact.firstName.toLowerCase().includes(searchText.value.toLowerCase()))
                return true;
            else if (contact.lastName.toLowerCase().includes(searchText.value.toLowerCase()))
                return true;
        });

        return newGroup;
    }).filter((group) => group.contacts.length > 0);
});
</script>

<template>
    <div>
        <SidebarHeader>
            <!--title-->
            <template v-slot:title>Contacts</template>

            <!--side actions-->
            <template v-slot:actions>
                <IconButton @click="openModal = true" aria-label="add contacts">
                    <UserPlusIcon class="w-[20px] h-[20px] text-emerald-300 hover:text-emerald-400 " />
                </IconButton>
            </template>
        </SidebarHeader>

        <!--search-->
        <div class="px-5 xs:pb-6 md:pb-5">
            <SearchInput v-model="searchText" />
        </div>

        <!--content-->
        <div ref="contactContainer" class="w-full h-full scroll-smooth scrollbar-hidden"
            style="overflow-x:visible; overflow-y: scroll;">
            <Loading2 v-if="contacts.loading" />

            <ContactGroups
                v-else-if="!contacts.loading && contacts.isFetched && contacts.contacts.length > 0"
                :contactGroups="filteredContactGroups"
                :bottom-edge="(contactContainer as HTMLElement)?.getBoundingClientRect().bottom" />

            <NoContacts v-else />
        </div>

        <!--add contact modal-->
        <AddContactModal :open-modal="openModal" :close-modal="() => openModal = false" />
    </div>
</template>
