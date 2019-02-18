// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/css/commom.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '../static/js/swiper.min.js'
import '../static/css/swiper.min.css'


Vue.config.productionTip = false
Vue.use(MintUI);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})