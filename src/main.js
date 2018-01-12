// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from '@/helper/currency'

Vue.use(VueLazyload, {
  loading: '/static/loading-svg/loading-bubbles.svg'}
);
Vue.use(infiniteScroll);
Vue.config.productionTip = false;

Vue.filter('currency', currency);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
