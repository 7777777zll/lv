// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import App from './App'
import routes from './config/routes'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import './js/socket.js';
import VueSocketio from 'vue-socket.io';
import { login } from './config/api'
// Vue.use(VueSocketio, 'http://192.168.10.245:5005');
Vue.use(VueSocketio, 'http://192.168.10.245:6001');
//虚拟键盘
// import VueTouchKeyboard from "vue-touch-keyboard";
import style from "vue-touch-keyboard/dist/vue-touch-keyboard.css"; // load default style
// Vue.use(VueTouchKeyboard);
Vue.use(ElementUI)
import global from './config/global'
Vue.prototype.global = global
Vue.prototype.loginOut = function(){
  login.loginOut()
    .then(data => {
      if(data){
        location.reload();
      }
    }, response => {
      console.info('fail')
    })
}
Vue.config.productionTip = false
// Vue.prototype.api = '/api'
const router = new VueRouter({
  routes,

});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
