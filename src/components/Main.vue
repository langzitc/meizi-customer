<template>
  <div style="height:100%;">
      <!-- main content -->
      <drawer 
        placement="left" 
        width="200px;"
        :show.sync="showLeftMenu"
        show-mode="overlay"
        :drawer-style="{'background-color':'#fff', width: '240px'}"        
      >
          <div slot="drawer" class="drawer-wrap">
              <div class="drawer-avatar">
                <flexbox :gutter="10" wrap="nowrap">
                  <flexbox-item :span="1/3">
                    <div class="drawer-avatar-left">
                      <img :src="avatar" @error="loaderror" class="d-avatar" @click="goSet">
                    </div>
                  </flexbox-item>
                  <flexbox-item :span="2/3">
                    <div class="drawer-avatar-right">
                      <p>{{name}}</p>
                      <p class="text-muted">{{mobile}}</p>
                      <p>{{card}}</p>
                    </div>
                  </flexbox-item>
                </flexbox>
              </div>
              <div class="drawer-menu">
                <flexbox :gutter="10" wrap="wrap" orient="vertical">
                  <flexbox-item :span="1">
                    <div class="drawer-menu-item">
                        <group>
                          <cell is-link link="/main/order_list" @click.native="showLeftMenu=false">
                            <micon name="idea" slot="icon" :scale="2.2" class="m-icon"></micon>
                            <span slot="title">我的订单</span>
                          </cell>
                        </group>
                        <group>
                          <cell is-link link="/main/member_card" @click.native="showLeftMenu=false">
                            <micon name="myvip" slot="icon" :scale="1.8" class="m-icon"></micon>
                            <span slot="title">我的会员卡</span>
                          </cell>
                        </group>
                        <group>
                          <cell is-link link="/main/quan" @click.native="showLeftMenu=false">
                            <micon name="quan" slot="icon" :scale="2.2" class="m-icon"></micon>
                            <span slot="title">我的奖金券</span>
                          </cell>
                        </group>
                        <group>
                          <cell is-link link="/main/set" @click.native="showLeftMenu=false">
                            <micon name="set" slot="icon" :scale="2.2" class="m-icon"></micon>
                            <span slot="title">设置</span>
                          </cell>
                        </group>
                        <group>
                          <cell is-link link="tel:18782915671" @click.native="tel">
                            <micon name="kefu" slot="icon" :scale="2" class="m-icon"></micon>
                            <span slot="title">联系客服</span>
                          </cell>
                        </group>                                                                                                
                    </div>
                  </flexbox-item>
                </flexbox>              
              </div>
          </div>
          <view-box ref="viewBox">              
            <x-header v-show="showTitle" style="z-index:100">
              <div slot="overwrite-left" v-if="isTime">
                  <x-icon type="person" size="24" @click.native="showLeftMenu=true"></x-icon>
              </div>
              <div slot="right" v-if="showLocation" @click="showSelect = true">
                <x-icon type="ios-location" size="16" style="color:#333"></x-icon>
                <span style="padding: 10px 0">{{city}}</span>
              </div>
              <div slot="right" v-if="showListToggle" @click="updateVartical">
                <micon name="list-th-lg" v-show="vertical === 'row'" scale="2"></micon>
                <micon name="nav-list" v-show="vertical === 'col'" scale="2.3"></micon>
              </div>              
              <span style="font-size:16px">{{title}}</span>
              <div v-transfer-dom>
                  <popup v-model="showSelect">
                      <!-- group already has a top border, so we need to hide header's bottom border-->
                      <popup-header
                      left-text="取消"
                      right-text="确定"
                      title="选择城市"
                      :show-bottom-border="false"
                      @on-click-left="pre"
                      @on-click-right="sure"></popup-header>
                      <group gutter="0">
                        <radio :options="cityList" v-model="selectCity2" :selected-label-style="{color:'#891E47'}"></radio>
                      </group>
                  </popup>
              </div>            
            </x-header>           
            <transition @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
            :name="viewTransition" :css="!!direction">
              <router-view class="router-view main-view"></router-view>
            </transition>      
          </view-box>          
      </drawer>    
  </div>
</template>

<script>
import { ViewBox,TransferDom,XHeader, Group, Radio, Popup, PopupHeader, Drawer, Flexbox, FlexboxItem, XImg, Cell  } from 'vux'
import { mapState, mapActions } from 'vuex'
import Avatar from '../../static/avatar2.png'
export default {
  directives: {
    TransferDom
  },  
  name: 'Main',
  data () {
    return {
      isTabbarDemo: false,
      showSelect: false,
      selectCity: '',  
      selectCity2: '',
      showLeftMenu: false  
    }
  }, 
  computed: {
    routePath () {
      return this.$route.path;
    },
    viewTransition () {
      if (!this.direction) return ''
      return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
    },
    cityList () {
      let p = this.storeCity.map(e=>{
          return {
            value: e.city_name,
            key: e.city_id
          }
      })
      return [...p];
    },
    showLocation () {
      return /appointment_store/.test(this.$route.path);
    }, 
    showListToggle () {
      return /works_list/.test(this.$route.path);
    },      
    isTime () {
      return /appointment_time/.test(this.$route.path);
    }, 
    card () {
      let member = this.$store.state.common.member;
      if(member.card&&member.card.name){
        return member.card.name;
      }else{
        return '未开卡';
      }
    },
    ...mapState({
      route: state => state.common.route,
      path: state => state.common.route.path,
      deviceready: state => state.common.deviceready,
      demoTop: state => state.common.demoScrollTop,
      isLoading: state => state.common.isLoading,
      direction: state => state.common.direction,
      showTitle: state => state.common.showTitle,
      city: state => state.common.location.city,
      storeCity: state => state.common.storeCity,
      avatar: state => state.common.member.avatar_url||'../../../static/avatar2.png',
      name: state => state.common.member.name,
      mobile: state => state.common.member.mobile,
      vertical: state => state.common.vertical,
      service_tel: state => state.common.brandStoreInfo.service_tel
    }),
    title () {
      return this.$store.state.common.title;
    }        
  },
  watch: {
    selectCity (n,o) {
      this.getStoreList(n);
    },
    routePath (n,o) {
      sessionStorage.setItem('mzmy_route_path',n);
    }
  },
  methods: {
    tel () {
      window.location.href = 'tel:'+this.service_tel;
    },
    goSet () {
      this.showLeftMenu = false;
      this.$router.push({
        name: 'set'
      })
    },
    loaderror(e) {
      e.target.src = Avatar;
    },
    ...mapActions([
      'getStoreCity'
    ]),
    pre () {
      this.showSelect = false;
      this.selectCity2 = this.selectCity;
    },
    updateVartical () {
      this.$store.commit('updateVartical',this.vertical === 'col' ? 'row' : 'col');
    },
    sure () {
      let clabel = this.storeCity.filter(e=>{
          return e.city_id == this.selectCity2;
      })[0].city_name;
      this.showSelect = false;
      this.$store.commit('updateCity',({
        city: clabel
      }));
      this.selectCity = this.selectCity2;
    },
    getStoreList (cid = '') {
      let params = {};
      if(cid){
        params.city_id = cid;
      }
      this.$store.dispatch('getStoreList',params);
    }    
  },
  components: {
    ViewBox,
    XHeader,
    Popup,
    Group,
    Radio,
    PopupHeader,
    Drawer,
    FlexboxItem,
    Flexbox,
    XImg,
    Cell      
  },
  created () {
    let appoinment = localStorage.getItem(this.$store.getters.prefix+"-order");
    let store = localStorage.getItem(this.$store.getters.prefix+"-store");
    let zaoxinshi = localStorage.getItem(this.$store.getters.prefix+"-zaoxinshi");
    if(appoinment){
      let d = JSON.parse(appoinment);
      this.$store.dispatch('updateOrder',d);
    }    
    if(zaoxinshi){
      let d = JSON.parse(zaoxinshi);
      this.$store.commit('setZaoxinshi',d);
    }
    if(store){
      let d = JSON.parse(store);
      this.$store.commit('setStore',d);
    }    
    this.getStoreCity();
    this.$store.dispatch('getMemberInfo');
  }
}
</script>

<style lang="less">
  .drawer-wrap{
    width: 100%;
    height: 100%;
    .weui-cells:before{
      border-top: none;
    }
    .weui-cells:after{
      border-bottom: none;
    }
  }
  .drawer-avatar{
    height: 100px;
    padding: 30px 0 40px 27px;
    box-sizing: border-box;
  }
  .drawer-menu{
    height: auto;
  }
  .drawer-avatar-left{
    width: 60px;
    height: 60px;
    box-sizing: border-box;
    img{
      width: 60px;
      height: 60px;;
      border-radius: 50%;
      border: 1px solid #000;
    }
  }
  .drawer-avatar-right{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    p{
      width: 100%;
      font-size: 0.8em;
    }
  }
  .m-icon{
    margin-right: 15px;
    margin-left: 15px;
    vertical-align: text-bottom;
  }
</style>
