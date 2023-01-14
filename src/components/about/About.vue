<script setup lang="ts">
import IndexNavbar from "./AboutNavbar.vue";

</script>

<template>
  <div>
    <index-navbar />
    <section
        class="header relative pt-16 items-center flex h-screen max-h-860-px"
    >
      <div class="container mx-auto items-center flex flex-wrap">
        <div class="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
          <div class="pt-28 sm:pt-0">
            <h2 class="font-semibold text-4xl text-slate-600">
              Chat Socket - A microservices system for realtime messaging.
            </h2>
            <p class="mt-6 text-lg leading-relaxed text-slate-500">
              Chat Socket is free and open source. It is built using Spring cloud websocket as backend
              and Vue 3 as frontend. Based on microservices architecture, Chat Socket can easily scale up
              and down according to your needs.
            </p>
            <div class="mt-10">
              <a
                  href="https://github.com/chat-socket/chat-socket"
                  target="_blank"
                  class="get-started text-white font-bold px-6 py-5 rounded-xs outline-none focus:outline-none mr-1 mb-1 bg-emerald-500 active:bg-emerald-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
              >
                Get started
              </a>
              <a
                  href="https://github.com/chat-socket/chat-socket"
                  class="github-star ml-1 text-white font-bold px-6 py-5 rounded-xs outline-none focus:outline-none mr-1 mb-1 bg-slate-700 active:bg-slate-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                  target="_blank"
              >
                Github Star
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
