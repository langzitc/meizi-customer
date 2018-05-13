<template>
  <div class="common-wrap pay-box common-view-box">
    <view-box>
        <group :gutter="0">
            <cell title="需付款">
                <span slot="default" class="text-amount" style="font-size:18px">￥{{dfk}}</span>
            </cell>                                                            
        </group>     
        <group :gutter="0" title="选择支付方式">
            <cell title="微信支付">
                <check-icon slot="default" :value.sync="isWx"></check-icon>
                <micon name="wx" slot="icon" :scale="2.2" class="p-ico"></micon>
            </cell>  
            <cell title="会员卡支付(当前余额￥500)" v-if="hasCard&&cardAvaliable">
                <check-icon slot="default" :value.sync="isCard"></check-icon>
                <micon name="vip" slot="icon" :scale="2.2" class="p-ico"></micon>
            </cell>  
            <cell title="会员卡支付(当前余额￥0)" disabled v-if="hasCard&&!cardAvaliable">
                <micon name="vip" slot="icon" :scale="2.2" class="p-ico disable"></micon>
                <p slot="inline-desc">余额不足，请及时<span class="text-amount">充值</span></p>
            </cell>                                                                             
        </group>   
        <foot></foot>        
    </view-box>           
    <div class="common-foot-tab" style="position:absolute;bottom:0">
        <x-button type="primary" :show-loading="isLoading" @click.native="sure">立即支付</x-button>
    </div>     
  </div>
</template>

<script>
import { Group, Cell, Flexbox, FlexboxItem, XButton, CheckIcon, ViewBox } from 'vux'
import { mapState } from 'vuex'
export default {
    name: 'appointment_pay',
    data () {
        return {
            isWx: true,
            isCard: false,
            isLoading: false,
            data: {}
        }
    },
    methods: {
        jsApiCall(jsApiParameters = null)
        {
            if(!jsApiParameters || !jsApiParameters.appId) {
                return ;
            }
            top.location.href="/pay/index/?id=" + this.data.id;
            return;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                jsApiParameters,
                function(res){
                    WeixinJSBridge.log(res.err_msg);
                    alert(res.err_code+"|" +res.err_desc +"|"+res.err_msg);
                }
            );
        },
        callpay(jsApiParameters)
        {
            console.log(jsApiParameters);
            this.jsApiCall(jsApiParameters);
        },
        sure () {
            this.isLoading = true;
            if(this.isWx){
                this.$http.post('/shop/checkout/startWeiPay',{
                    id: this.data.id
                }).then(res=>{
                    if(res.code == 301) {
                        location.href=res.data.redirect;
                        return;
                    } else {
                        console.log(res.data.js_api_parameters)
                        let t;
                        eval("t = "  + res.data.js_api_parameters + ";");
                        this.callpay(t);
                    }
                    this.isLoading = false;
                    this.$router.push({
                        name: 'appointment_paysuccess'
                    });
                }).catch(e=>{
                    this.isLoading = false;
                })
            }else{
                this.$http.post('/shop/checkout/capture',{
                    id: this.data.id
                }).then(res=>{
                    this.isLoading = false;
                    if(res.code === 200){
                        this.$router.push({
                            name: 'appointment_paysuccess',
                            query: {
                                id: this.data.id,
                                amount: this.dfk
                            }
                        });
                    }else{
                        this.$vux.alert.show({
                            title: '提示',
                            content: res.message
                        })                          
                    }
                }).catch(e=>{
                    this.isLoading = false;
                })
                    
            }
        }
    },
    computed: {
        dfk () {
            let n = 0;
            if(this.data.payments&&this.data.payments.length){
                this.data.payments.forEach(e=>{
                    if(e.method === 'ToBeDetermined'){
                        n+=parseFloat(e.amount);
                    }
                })
            }
            return n.toFixed(2);
        },
        hasCard () {
            return this.memberInfo.cards&&this.memberInfo.cards.length > 0;
        },
        cardAvaliable () {
            return true;
        },
        ...mapState({
            actual_order: state => state.appointment.actual_order,
            memberInfo: state => state.common.memberInfo
        })
    },
    watch: {
        isWx (n,o){
            if(n){
                this.isCard = false;
            }else{
                this.isCard = true;
            }
        },
        isCard (n,o){
            if(n){
                this.isWx = false;
            }else{
                this.isWx = true;
            }
        } 
    },
    mounted () {

        if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
            }
        }

        let id = this.$route.query.id;
        if(id){
            if(!this.actual_order.id){
                this.$store.commit('updateLoadingStatus',{
                    isLoading: true
                });                   
                this.$http.post('/shop/customer/order/info',{
                    order_id: id
                }).then(res=>{
                    this.data = res.data;
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });   
                }).catch(e=>{
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                       
                })
            }else{
                Object.assign(this.data,this.actual_order);
            }
        }else{
            this.$router.go(-1);
        }
    },
    components: {
        Group,
        Cell,
        XButton,
        Flexbox,
        FlexboxItem,
        CheckIcon,
        ViewBox
    }     
}
</script>

<style lang="less">
    .p-ico{
        vertical-align:text-bottom;
        margin-right:15px;        
        .disable{
            fill: #777;
        }
    }
    .inline-desc{
        font-size: 12px;
    }
    .pay-box{
        height: 100%;
        box-sizing: border-box;
        .vux-label{
            font-size: 16px;
        }
        .weui-icon-success-circle{
            color: rgb(139, 27, 68);
        }
        .weui-icon-success{
            color: rgb(139, 27, 68);
        }   
        .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
            color: rgb(139, 27, 68);
        }   
    }
</style>
