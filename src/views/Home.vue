<script setup lang="ts">
import Chat from "../components/home/Chat/Chat.vue";
import Navigation from "../components/home/Navigation/Navigation.vue";
import Sidebar from "../components/home/Sidebar/Sidebar.vue";

</script>

<template>
    <KeepAlive>
        <div class="xs:relative md:static h-full flex xs:flex-col md:flex-row overflow-hidden">
            <Navigation class="xs:order-1 md:-order-none" />
            <Sidebar class="xs:grow-1 md:grow-0 xs:overflow-y-scroll md:overflow-visible scrollbar-hidden" />
            <Chat />
        </div>
    </KeepAlive>
</template>