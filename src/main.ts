import vClickOutside from "click-outside-vue3";
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(vClickOutside).mount('#app');
