import Vue from 'vue';
import Navigation from './navigation';
import App from './App';
import router from './router';
import store from './store';

Vue.use(Navigation, { router, store });

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
