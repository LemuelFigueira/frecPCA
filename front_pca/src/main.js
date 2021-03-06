import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import Vuex from "vuex";
import store from "./store";
import Vuelidate from "vuelidate";
import Clipboard from "v-clipboard";
import money from "v-money";

Vue.use(money, { precision: 2 });
Vue.use(Clipboard);
Vue.use(Vuelidate);
Vue.use(Vuex);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
