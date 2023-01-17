<script setup lang="ts">
import { useContactsStore } from "../../../stores/contacts";
import { Message } from "../../../stores/conversations";
import { getFullName } from "../../../utils";

import Typography from "../../reusables/Typography.vue";

const props = defineProps<{
    message: Message
}>();

const contacts = useContactsStore();
</script>

<template>
    <button class="w-full p-5 flex outline-none hover:bg-emerald-100 focus:bg-emerald-100
         active:bg-emerald-200 dark:hover:bg-gray-600 dark:focus:bg-gray-600 duration-200">
        <!--profile image-->
        <div class="mr-4">
            <div :style="{ backgroundImage: `url(${contacts.getContact(props.message.sender)?.avatar})`}"
                class="w-7 h-7 rounded-full bg-cover bg-center">
            </div>
        </div>

        <!--name and message-->
        <div class="grow">
            <div class="flex flex-col items-start">
                <Typography variant="heading-2" class="mb-4">
                    {{ getFullName(contacts.getContact(props.message.sender)!) }}
                </Typography>

                <Typography variant="body-2">
                    Wow really cool
                </Typography>
            </div>
        </div>

        <!--message date-->
        <div>
            <p class="opacity-60 font-light text-xs leading-4 tracking-[0.16px]">
                <Typography variant="body-4">
                    1/5/2019
                </Typography>
            </p>
        </div>
    </button>
</template>