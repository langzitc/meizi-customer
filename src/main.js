import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Foot from './components/Foot'
import { ConfigPlugin, BusPlugin, AlertPlugin, cookie, WechatPlugin } from 'vux'
import axios from 'axios'
import Icon from 'vue-svg-icon/Icon.vue'
import qs from 'qs'
import wxconfig from './wxconfig'
import LocalStorageFactory from "./model/LocalStorageFactory"
import { setTimeout } from 'timers';
Vue.component('foot', Foot)
// Vue.use(WechatPlugin);
// Vue.wechat.config(wxconfig);
require('es6-promise').polyfill()
Vue.config.productionTip = false;
/**
 * 过滤器
 */
Vue.filter('money', (value) => {
  if(/^(-?\d+)(\.\d+)?$/.test(value)){
    return parseFloat(value).toFixed(2);
  }else{
    return value;
  }
})
Vue.filter('money_int', (value) => {
  if(/^(-?\d+)(\.\d+)?$/.test(value)){
    return parseFloat(value).toFixed(0);
  }else{
    return value;
  }
})
Vue.filter('zhekou', (value) => {
  return parseInt(value)
})
Vue.filter('limit', (value,len = 30) => {
  let str = String(value);
  if(str.length < len || str.length === len){
    return value;
  }
  return String(value).substr(0,len)+'...';
})
// API path config
const routeUrl = window.location.href.split("#")[0];
window.API_PATH = global.API_PATH = null;
let brandStoreId = 0;
let temp = routeUrl.split("/");
brandStoreId = temp[3];

if(routeUrl.indexOf("meizitop.com") != -1) {
    window.API_PATH = global.API_PATH =  `/${brandStoreId}/api/v1`;
} else {
    window.API_PATH = global.API_PATH = `http://shop.test.meizitop.com/${brandStoreId}/api/v1`;
}
if(!brandStoreId) {
    if(window.alert) {
        window.alert("错误的URL地址")
    }
}
axios.defaults.baseURL = `${API_PATH}`;
axios.defaults.transformResponse = (data)=>{
  return data;
}
axios.defaults.withCredentials = true;
//返回拦截器
axios.interceptors.response.use(function(response){
    let data = JSON.parse(response.data);
    if(data.code == 413) {
        store.commit('updateLoginStatus',false);
        localStorage.setItem('mzmy_member_session',null);
    }
    return data;

},function(error){
    //对返回的错误进行一些处理
    return Promise.reject(error);
});
Vue.prototype.$http = axios;
/* eslint-disable no-new */
const history = window.sessionStorage;
history.clear();
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false;
let endTime = Date.now();
let methods = ['push', 'go', 'replace', 'forward', 'back'];
document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
});
store.commit('updateMember');
let isFirst = true;
//sid 初始化
const sidInit = (async ()=>{
  let sid = localStorage.getItem('mzmy-sid');
  if(!sid){
    let res = await axios.post('/public/init');
    sid = res.data.sid;
    localStorage.setItem('mzmy-sid',sid);
  }
  axios.defaults.headers.sid = sid;   
})();
router.beforeEach(async  function (to, from, next) {
  //是否登录, 每访问10 个页心跳检测一下服务器端登陆状态是否过期
  let memberSession = LocalStorageFactory.getCustomer();
  if(isFirst % 10 == 0){
    let d = await  axios.get('/shop/member/isLogged');
    if(d.data&&d.data.sid){
        store.commit('updateLoginStatus',d.data.result ? true : false);
        if(memberSession.id != d.data.customer_id) {
            store.commit('updateLoginStatus',false);
        }
    }   
    isFirst++;
  }

  let status = store.getters.isLogin;
  if(!status) {
      if(memberSession && memberSession.id) {
          store.commit('updateLoginStatus',true);
          store.commit('updateMember');
          status = store.getters.isLogin;
      }
  }

  if(to.name==='login'){
      if(status){
        next({
          name: 'home'
        });
        return;
      }
  }else{
    if(!status){
      next({name: 'login'});
      return;
    }
  }  
  //滑动
  store.commit('updateLoadingStatus', {isLoading: true});
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', {direction: ''})
      } else {
        store.commit('updateDirection', { direction: 'reverse' })
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }
  next();
})
const FastClick = require('fastclick')
FastClick.attach(document.body);
router.afterEach(function (to) {
  if(to.meta&&to.path.includes('main')){
    if(!to.meta.hidetitle){
      store.commit("updateShowTitleStatus",true);
      if(to.meta.title){
        store.commit("updateTitle",{
          title: to.meta.title
        });
      }
    }else{
      store.commit("updateShowTitleStatus",false);
    }
  }
  store.commit('updateLoadingStatus', {isLoading: false})
})
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})
// plugins
Vue.use(BusPlugin);
Vue.use(AlertPlugin);
Vue.component('micon', Icon);
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
