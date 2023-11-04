import { createApp } from 'vue';
import App from './App.vue';

import './style.css';

const app = createApp(App);

setTimeout(() => {
  app.mount('#app');
}, 3000);
