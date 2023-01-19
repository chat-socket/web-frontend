<script setup lang="ts">
import { Contact, useContactsStore } from '../../../../stores/contacts';

import Loading1 from '../../../reusables/loading/Loading1.vue';
import SearchInput from '../../../reusables/SearchInput.vue';
import ContactItem from '../../Sidebar/Contacts/ContactItem.vue';
import NoContacts from "../../../reusables/emptyStates/NoContacts.vue";

const contacts = useContactsStore();
</script>

<template>
    <div class="pb-6">
        <!--search-->
        <div class="mx-5 mb-5">
            <SearchInput :outline="true" />
        </div>

        <!--contacts-->
        <div class="overflow-y-scroll scrollbar scrollbar-hidden max-h-[200px]">
            <Loading1 v-if="contacts.loading" />

            <ContactItem
                v-else-if="!contacts.loading && contacts.isFetched && contacts.contacts!.length > 0"
                v-for="(contact, index) in contacts.contacts" :key="index" :contact="contact" />

            <NoContacts vertical v-else />
        </div>
    </div>
</template>