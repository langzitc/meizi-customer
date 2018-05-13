<template>
  <div class="common-wrap">
      <tab v-model="tabIndex">
        <tab-item>未使用</tab-item>
        <tab-item>已使用</tab-item>
        <tab-item>已过期</tab-item>
      </tab>   
      <div class="quan-list-box" v-show="couponList.length">
          <div class="quan-list-items" v-for="el in couponList" :key="el.id">
              <div class="quan-list-item-left text-center">
                  <div class="quan-list-item-text" style="font-size:30px;">￥{{el.amount}}</div>
                  <div class="quan-list-item-text text-elips" style="font-size:0.8em;margin-top:10px">{{el.title}}</div>
              </div>
              <div class="quan-list-item-right">
                  <p>有效期至&nbsp;{{format(el.expired_at)}}</p>
                  <p>抵扣范围:&nbsp;可抵扣服务项目消费</p>
                  <p>使用说明:&nbsp;移动端可抵扣服务费</p>
              </div>
          </div>        
      </div> 
      <msg v-show="!couponList.length" title="您没有可用的奖金券"  icon="info"></msg>  
  </div>
</template>

<script>
import { Tab, TabItem, dateFormat, Msg } from 'vux'
import { mapState, mapActions } from 'vuex'
export default {
    name: 'quan',
    data () {
        return {
            tabIndex: 0
        }
    },
    components: {
        Tab,
        TabItem,
        Msg
    },
    watch: {
        tabIndex (n,o) {
            let params;
            console.log(n)
            switch(n){
                case 0: 
                    params = {
                        status: 0,    
                        is_show_expired: 0                           
                    }
                break;
                case 1: 
                    params = {
                        status: 1,
                    }
                break;
                case 2:
                    params = {
                        is_only_show_expired: 1,
                        status: 0,
                    }
                break;
            }
            this.$store.dispatch('getCoupon',params);            
        }
    },
    methods: {
        format (date) {
            return dateFormat(date,'YYYY-MM-DD')            
        }        
    },
    computed: {
        ...mapState({
            couponList: state => state.common.couponList
        })    
    },
    mounted () {
        this.$store.dispatch('getCoupon',{
            status: 0,    
            is_show_expired: 0        
        });
    }
}
</script>

<style scoped lang="less">
    .quan-list-box{
        padding: 15px;
        box-sizing: border-box;
        .quan-list-items{
            display: flex;
            justify-content: space-between;
            height: 100px;
            margin-top: 20px;
            border: 1px solid #777;
            border-radius: 8px;
            position: relative;
            .quan-list-item-left{
                width: 150px;
                background-color: #891E47;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                color: #fff;
                .quan-list-item-text{
                    height: 50px;
                    &:first-child{
                        line-height: 65px;
                    }
                }                  
            }
            .quan-list-item-right{
                width: 100%;
                padding: 15px 20px;
                font-size: 0.8em;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                color: #333;
            }       
            &.expired{
                .quan-list-item-left{
                    background-color: #999;              
                }
                .quan-list-item-right{
                    color: #777;
                }  
                &:after{
                    content: '已过期';
                    display: block;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    padding: 2px 7px;
                    border-radius: 10px;
                    font-size: 0.8em;
                    background-color: #777;
                    color: #fff;
                }
            }   
        }
    }
</style>
