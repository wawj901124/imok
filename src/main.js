// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'  //  导入vue-lazyload
import InfiniteScroll from 'vue-infinite-scroll'  //  导入vue-infinite-scroll

Vue.config.productionTip = false

// 使用vue-lazyload
Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"   // 设置图片没有加载出来时的loading的效果
});

//使用vue-infinite-scroll插件
Vue.use(InfiniteScroll)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
