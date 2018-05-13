<template>
  <div class="app-box" v-bind:class="[isLoginPage ? 'login-box' : '',showTitle ? 'view-showheader' : 'view-hideheader']">
      <!--
      <div style="position:absolute;top:0">
          <img style="width:100%;height:70px;" src="../static/logo2.png" alt="">
      </div>
      -->
      <!-- main content -->
      <view-box ref="viewBox">
        <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
        :name="viewTransition" :css="!!direction">
          <router-view class="router-view"></router-view>
        </transition>
        <div v-transfer-dom>
          <loading :show="isLoading" text="加载中"></loading>
        </div>    
      </view-box>             
  </div>
</template>

<script>
import { ViewBox,TransferDom, Loading } from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
  directives: {
    TransferDom
  },  
  name: 'App',
  data () {
    return {}
  }, 
  computed: {
    viewTransition () {
      if (!this.direction) return ''
      return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
    },
    isLogin () {
      return this.$store.getters.isLogin;
    },
    isLoginPage () {
      return this.$route.name === 'login';
    },
    ...mapState({
      route: state => state.common.route,
      path: state => state.common.route.path,
      deviceready: state => state.common.deviceready,
      demoTop: state => state.common.demoScrollTop,
      isLoading: state => state.common.isLoading,
      direction: state => state.common.direction,
      showTitle: state => state.common.showTitle
    })        
  },
  methods: {  
  },
  watch: {
    isLogin (n,o) {
      if(!n){
        this.$router.push({
          name: 'login'
        });
      }
    }
  },
  created () {
    this.$store.dispatch('getBrandStoreInfo');
  },
  components: {
    ViewBox,
    Loading
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
@import './theme/base.less';
@font-face {
  font-family: 'vux-mzmy';  /* project id 70323 */
  src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot');
  src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.woff') format('woff'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.svg#iconfont') format('svg');
}
.mzmy-icon{
  font-family: 'vux-mzmy';
  font-size: 22px;
  color: #ccc;  
}
body {
  background-color: #F5F5F5;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-size: 14px;
}
a{
  color: #891E47;
}
.router-view {
  width: 100%;
  position:absolute;
}
.view-showheader{
  .router-view{
    top: 0px;
    &.main-view{
      padding-top: 46px;
    }      
  }
}
.view-hideheader{
  .router-view{
    top: 0px;
    &.main-view{
      padding-top: 0px;
    }     
  } 
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 0;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.weui-tab .weui-tab__panel{
  padding-bottom: 0;
}
</style>
