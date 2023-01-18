import useAuthStore, { User } from "./stores/auth";
import { Conversation, Message, useConversationsStore } from "./stores/conversations";
import { Contact, useContactsStore } from "./stores/contacts";
import { Call } from "./stores/calls";
import moment, { Moment } from 'moment'



// combine first name and last name of a contact
export const getFullName = (contact: Contact) => {
    return contact.firstName + ' ' + contact.lastName;
};

// get the other contact that is not the authenticated user.
export const getOddContact = (conversation?: Conversation) => {
    let oddContact;
    const auth = useAuthStore();
    
    for (let contact of (conversation as Conversation).contacts) {
        if (contact !== (auth.user as User).id) {
            oddContact = contact;
        }
    }

    return oddContact;
};

// get avatar based on conversation type
export const getAvatar = (conversation?: Conversation) => {
    if (['group', 'boradcast'].includes((conversation as Conversation).type)) {
        return conversation?.avatar;
    } else {
        const contacts = useContactsStore();
        let oddContact = getOddContact(conversation);
        return contacts.getContact(oddContact)?.avatar
    }
};

// get name based on conversation type
export const getName = (conversation?: Conversation) => {
    if (['group', 'boradcast'].includes((conversation as Conversation).type)) {
        return conversation?.name;
    } else {
        const contacts = useContactsStore();
        let oddContact = getOddContact(conversation);
        return getFullName(contacts.getContact(oddContact)!);
    }
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

export const getOtherMembers = (call: Call) => {
    let members = [];

    if (call) {
        const auth = useAuthStore();
        for (let member of call.members) {
            if (member !== (auth.user as User).id) {
                members.push(member);
            }
        }
    }

    return members;
};


export const getCallName = (call: Call, full?: boolean, maxLength: number = 20) => {
    let members = getOtherMembers(call);
    let callName: string = '';
    const contacts = useContactsStore();

    for (let member of members) {
        callName += getFullName(contacts.getContact(member)!)

        if (members.length > 1) {
            callName += ', '
        }
    }

    if (full) {
        return callName;
    } else {
        return shortenText(callName, maxLength);
    }
};

export const parseJSON = (jsonText: string | null) => {
    if (jsonText == null) {
        return null;
    }
    return JSON.parse(jsonText);
}
