<template>
  <div class="common-wrap" style="background:#fff"> 
      <div class="quan-list-box" v-show="data.length">
          <flexbox v-for="(el,index) in data" :key="index" align="middle">
              <flexbox-item :span="1/6">
                    <check-icon :value.sync="el.checked"></check-icon>
              </flexbox-item>
              <flexbox-item :span="5/6">
                    <div class="quan-list-items">
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
              </flexbox-item>
          </flexbox>      
      </div> 
      <msg v-show="!data.length" title="您没有可用的现金券" description="您可以通过评论技师等渠道获得优惠券" :buttons="[{type: 'default',text:'去评论',link: 'order_talk'}]" icon="info"></msg>  
      <foot></foot>  
  </div>
</template>

<script>
import { Msg, dateFormat, Flexbox, FlexboxItem, CheckIcon } from 'vux'
import { mapState, mapActions } from 'vuex'
let _this;
export default {
    name: 'select-quan',
    data () {
        return {
            data: []
        }
    },
    methods: {
        format (date) {
            return dateFormat(date,'YYYY-MM-DD')            
        }
    },
    watch: {
        couponList: {
            deep: true,
            handler: ()=>{
                _this.formatList();    
            }
        }
    },
    computed: {
        formatList () {
            let d = JSON.parse(JSON.stringify(this.couponList));
            d.forEach(e=>{
                e.checked = false;
            });
            this.data = d;
        },
        ...mapState({
            couponList: state => state.common.avaliableCouponList
        })    
    },
    mounted () {
        _this = this;
        this.formatList();
    },
    components: {
        Msg,
        Flexbox,
        FlexboxItem,
        CheckIcon
    }
}
</script>

<style lang="less">
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
                width: 170px;
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
        }
        .weui-icon-success-circle{
            color: rgb(139, 27, 68);
            font-size: 20px;
        }
        .weui-icon-success{
            color: rgb(139, 27, 68);
            font-size: 20px;
        }   
        .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
            color: rgb(139, 27, 68);
            font-size: 20px;
        }  
        .weui-icon-circle{
            font-size: 20px;
        }          
    }
</style>
