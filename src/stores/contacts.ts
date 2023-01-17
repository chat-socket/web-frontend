import {defineStore} from "pinia";
import contactsData from "../assets/data/contacts.json";
import {computed, ref, Ref} from "vue";
import { plainToInstance, Type } from 'class-transformer';


export class Contact {
    id!: string;
    firstName!: string;
    lastName!: string;
    avatar!: string;
    email?: string;

    @Type(() => Date)
    lastSeen!: Date;
};


export interface ContactGroup {
    letter: string,
    contacts: Contact[],
};


export const useContactsStore = defineStore('contacts', {
    state: () => {
        const contacts: Ref<Contact[]> = ref(plainToInstance(Contact, contactsData.contacts))

        const contactMap: Ref<Map<string, Contact>> = computed(() => {
            let map: Map<string, Contact> = new Map();
            for (let contact of contacts.value) {
                map.set(contact.id, contact);
            }
            return map;
        })

        const contactGroups: Ref<ContactGroup[] | undefined> = computed(() => {
            let sortedContacts = [...(contacts.value as Contact[])];

            sortedContacts.sort();

            let groups: ContactGroup[] = [];
            let currentLetter: string = '';
            let groupNames: string[] = [];

            // create an array of letter for every different sort level.
            for (let contact of sortedContacts) {
                // if the first letter is different create a new group.
                if (contact.firstName[0].toUpperCase() !== currentLetter) {
                    currentLetter = contact.firstName[0].toUpperCase();
                    groupNames.push(currentLetter)
                }
            }

            // create an array that groups contact names based on the first letter;
            for (let groupName of groupNames) {
                let group: ContactGroup = { letter: groupName, contacts: [] };
                for (let contact of sortedContacts) {
                    if (contact.firstName[0].toUpperCase() === groupName) {
                        group.contacts.push(contact);
                    }
                }
                groups.push(group);
            }

            return groups;
        });

        return {
            contacts,
            contactGroups,
            contactMap
        }
    },
    actions: {
    },
    getters: {
        isLoaded(state) {
            return true;
        },

        getContact: (state) => (contactId: string | undefined) => {
            if (contactId === undefined) {
                return undefined;
            }
            return state.contactMap.get(contactId);
        }
    }
})