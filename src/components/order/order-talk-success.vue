<template>
  <div class="common-wrap">
      <div class="text-center talk-s-box">
          <p>
              <micon name="talksuccess" scale="5"></micon>
          </p>
          <p style="font-size:1.8em;margin-top:15px">
              发布评价成功
          </p>
          <p class="text-muted" style="margin-top:15px">
              感谢您的评价
          </p>
          <div style="margin: 20px 0 50px 0">
              <x-button class="fhsy ots-btn" link="/">返回首页</x-button>
          </div>
          <div v-show="coupon.id">
              <p>
                  为了感谢您对我们的认可，福利送上
              </p>
              <div class="ots-quan text-center">
                    <h1 style="color:#fff">{{coupon.amount}} 元奖金券</h1>
                    <p style="color:#fff">使用说明：移动端可抵扣服务费用</p>
              </div>
              <div style="margin: 20px 0 50px 0">
                  <x-button type="primary" class="ots-btn" @click.native="activeCoupon()">立即领取</x-button>
              </div>
          </div>
      </div>
      <foot></foot>  
  </div>
</template>

<script>
import { XButton } from 'vux'
export default {
    name: 'order-talk-success',
    data () {
        return {
            coupon_id:null,
            coupon: {}
        }
    },
    components: {
        XButton
    },
    methods: {
        activeCoupon() {
            let params = {
                id: this.coupon_id
            }
            this.loading = true;
            this.$http.post('/shop/review/activeCoupon',params).then(res=>{
                console.log(res);
                this.$vux.alert.show({
                    title: '提示',
                    content: '领取奖金券成功!'
                })
                this.loading = false;
            }).catch(e=>{
                this.loading = false;
                this.$vux.alert.show({
                    title: '提示',
                    content: '激活奖金券失败!'
                })
            })
        },
        initCouponInfo() {
            let params = {
                id: this.coupon_id
            }
            this.loading = true;
            this.$http.post('/shop/customer/account/couponInfo',params).then(res=>{
                this.coupon = res.data;
                this.loading = false;
            }).catch(e=>{
                this.loading = false;
                this.$vux.alert.show({
                    title: '提示',
                    content: '获取奖金券信息失败!'
                })
            })
        }
    },
    mounted() {
        this.coupon_id = this.$route.query.coupon_id;
        if(this.coupon_id) {
            this.initCouponInfo();
        }
    }
}
</script>

<style lang="less">
    .talk-s-box{
        padding-top: 50px;
        background-color: #fff;
        -moz-box-sizing: border-box;
        height: 100%;
        .fhsy{
            background-color:#fff;
            border: 1px solid #891E47;
            color: #891E47;        
        }
        .ots-btn{
            width: 50%;
            box-sizing: border-box;              
        }
        .ots-quan{
            width: 300px;
            margin: 20px auto;
            height: 120px;
            background-image: url(../../../static/quan-bg2.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            padding-top: 20px;
            box-sizing: border-box;
        }
    }
</style>
