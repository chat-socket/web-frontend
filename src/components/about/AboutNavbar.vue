<script setup lang="ts">
import useAuthStore from "../../stores/auth";

const auth = useAuthStore();

</script>

<template>
  <nav class="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-3 py-5 navbar-expand-lg bg-white shadow" >
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between" >
      <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start" >
        <router-link to="/">
          <a class="text-slate-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
              href="/" >
            Chat Socket
          </a>
        </router-link>
        <button
            class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button" >
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <div class="lg:flex flex-grow items-center"
          :class="'block'"
          id="example-navbar-warning" >
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li class="flex items-center">
            <a class="hover:text-slate-500 text-slate-700 px-5 py-2 flex items-center text-xs uppercase font-bold"
                href="https://www.facebook.com/sharer/sharer.php?u=link"
                target="_blank" >
              <i class="text-slate-400 fab fa-facebook text-lg leading-lg" />
              <span class="lg:hidden inline-block ml-2">Share</span>
            </a>
          </li>

          <li class="flex items-center">
            <a class="hover:text-slate-500 text-slate-700 px-5 py-2 flex items-center text-xs uppercase font-bold"
                href="https://twitter.com/intent/tweet?url=link"
                target="_blank" >
              <i class="text-slate-400 fab fa-twitter text-lg leading-lg" />
              <span class="lg:hidden inline-block ml-2">Tweet</span>
            </a>
          </li>

          <li class="flex items-center">
            <a class="hover:text-slate-500 text-slate-700 px-5 py-2 flex items-center text-xs uppercase font-bold"
                href="https://github.com/chat-socket/chat-socket"
                target="_blank" >
              <i class="text-slate-400 fab fa-github text-lg leading-lg" />
              <span class="lg:hidden inline-block ml-2">Star</span>
            </a>
          </li>

          <li class="flex items-center">
            <button class="bg-emerald-500 text-white active:bg-emerald-600 text-xs font-bold uppercase px-5 py-3 rounded-xs shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                type="button" @click="auth.login()">
              Login
            </button>
          </li>

          <li class="flex items-center">
            <a class="hover:text-slate-500 text-slate-700 px-5 py-2 flex items-center text-xs uppercase font-bold"
               href="http://accounts.chat-socket.io/register" >
              Register
            </a>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

