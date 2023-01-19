import useAuthStore, { User } from "./stores/auth";
import { Conversation, Message, useConversationsStore } from "./stores/conversations";
import { Contact, useContactsStore } from "./stores/contacts";
import { Call } from "./stores/calls";
import moment, { Moment } from 'moment'



// combine first name and last name of a contact
export const getFullName = (contact: Contact) => {
    return contact.firstName + ' ' + contact.lastName;
};

// trim message content.
export const shorten = (message: Message, maxLength: number = 23) => {
    return shortenText((message.content as string), maxLength);
};

// trim string.
export const shortenText = (text: string, maxLength: number = 23) => {
    if (text) {
        let trimmedString = text;

        if (text.length > maxLength) {
            // trim the string to the maximum length.
            trimmedString = trimmedString.slice(0, maxLength);
            // add three dots to indicate that there is more to the message.
            trimmedString += '...';
        }

        return trimmedString;
    }

    return '';
};

// test if the message contains attachments
export const hasAttachments = (message: Message) => {
    let attachments = message.attachments;
    return attachments && attachments.length > 0;
};


export const parseJSON = (jsonText: string | null) => {
    if (jsonText == null) {
        return null;
    }
    return JSON.parse(jsonText);
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}