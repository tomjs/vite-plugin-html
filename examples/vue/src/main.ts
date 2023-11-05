import { createApp } from 'vue';
import antd from 'ant-design-vue';
import App from './App.vue';

import './style.css';

const app = createApp(App);
app.use(antd);

setTimeout(() => {
  app.mount('#app');
}, 1000);
