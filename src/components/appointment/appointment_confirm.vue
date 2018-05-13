<template>
<div class="common-wrap common-view-box">
    <view-box>
    <div style="height:100%;width:100%;overflow:auto;-webkit-overflow-scrolling : touch">
        <div class="zxs-select">
                <flexbox :gutter="0">
                    <flexbox-item :span="1/4" class="zxs-select-ava" style="height:100%"> 
                        <img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4262722575,2863700927&fm=27&gp=0.jpg" alt="">                 
                    </flexbox-item>   
                    <flexbox-item :span="3/4" class="zxs-select-right">
                        <p>
                            {{zaoxinshi.name}}<span class="tag tag-primary">{{zaoxinshi.job_title_name}}</span>  
                        </p>                    
                        <p class="text-muted" style="font-size:12px;margin-top:5px">{{store.name}}</p>
                    </flexbox-item>                     
                </flexbox>        
            </div>
            <group :gutter="0" title="选购服务" style="background:#fff;">
                <cell :title="showName(el)" v-if="order.items.length" v-for="(el,index) in order.items" :key="index">
                    <span slot="default">￥{{el.price}}</span>
                </cell> 
                <cell>
                    <div slot="default" style="width:200px;">
                        <flexbox justify="flex-end">
                            <flexbox-item :span="1/4" class="text-right">
                                合计:
                            </flexbox-item>
                            <flexbox-item :span="1/4" class="text-right">
                                ￥{{total_1}}
                            </flexbox-item>
                        </flexbox>
                        <flexbox justify="flex-end" class="text-amount">
                            <flexbox-item :span="2/4" class="text-right" v-if="cardZk">
                                <span class="tag tag-primary" style="padding: 5px">{{cardZk}}</span>
                            </flexbox-item>                    
                            <flexbox-item :span="1/4" class="text-right">
                                折扣价:
                            </flexbox-item>
                            <flexbox-item :span="1/4" class="text-right">
                                ￥{{total_1}}
                            </flexbox-item>
                        </flexbox>                
                    </div>
                </cell>           
                <cell title="奖金券" :is-link="true" link="select_quan" :disabled="hasCoupons">
                    <span slot="default">
                        <span v-show="coupons>0" class="text-amount">
                            {{coupons}}张可用
                        </span>
                        <span v-show="coupons === 0">
                            {{coupons}}张可用
                        </span>                
                    </span>
                </cell>   
                <cell title="赠送金" :is-link="true" :link="{name: 'select_zsj',query: {price: total_2,give_amount}}" :disabled="!hasGiveAmount&&give_amount == 0">
                    <span slot="default">
                        <span class="text-amount" v-if="currentGiveAmount == 0">
                            {{give_amount}}元可用
                        </span>            
                        <span class="text-amount" v-if="currentGiveAmount > 0">
                            ￥{{currentGiveAmount}}
                        </span>
                    </span>
                </cell>                                                                     
            </group>       
            <div class="yyinfo">
                <p>
                    <span class="title">预约号码:</span>{{mobile}}
                </p>
                <p>
                    <span class="title">预约时间:</span>{{appointment_start_at}}
                </p>
                <p class="text-elips"> 
                    <span class="title">预约地址:</span>{{address}}
                </p>                
            </div>        
    </div> 
    <foot></foot>            
    </view-box>          
    <div class="common-foot-tab">
        <flexbox :gutter="0">
            <flexbox-item :span="2/3">
                <span>需付款</span>
                <span class="text-primary" style="font-size:16px">￥{{total_2}}</span>                    
            </flexbox-item>   
            <flexbox-item class="text-right" :span="1/3">
                <x-button style="width:120px" type="primary" :show-loading="loading" @click.native="sure">提交订单</x-button>
            </flexbox-item>                     
        </flexbox>
    </div>       
</div>  
</template>

<script>
import { Group, Cell, Flexbox, FlexboxItem, XButton, ViewBox } from 'vux'
import { mapState, mapActions } from 'vuex'
import { setTimeout } from 'timers';
export default {
    name: 'appointment_confirm',
    data () {
        return {
            loading: false
        }
    },
    methods: {
        sure () {
            this.loading = true;
            this.$store.dispatch('submitOrder').then((res)=>{
                this.loading = false;
                this.$vux.alert.show({
                    title: '提示',
                    content: res.message,
                    onHide: ()=>{
                        location.href="/pay/index/?id=" + res.data.id;
                        return;
                        this.$router.push({
                            name: 'appointment_pay',
                            query: {
                                id: res.data.id
                            }
                        });                     
                    }
                });
                                  
            }).catch(message=>{
                this.loading = false;
                this.$vux.alert.show({
                    title: '提示',
                    content: message
                });                
            });
        },
        showName (el) {
            if(el.$label){
                return `${el.product_name}(${el.$label})`;
            }else{
                return `${el.product_name}`;
            }
        }
    },
    computed: {
        coupons () {
            return this.couponList.length;
        },
        total_1 () {
            let n = 0;
            if(this.order&&this.order.items){
                this.order.items.forEach(e=>{
                    n+=parseFloat(e.origin_price);
                })
            }
            return n.toFixed(2);
        },
        total_2 () {
            let n = 0;
            if(this.order&&this.order.items){
                this.order.items.forEach(e=>{
                    n+=parseFloat(e.price);
                })
            }
            n-=this.currentGiveAmount;
            return n.toFixed(2);
        },        
        hasCoupons () {
            return this.coupons === 0;
        },
        give_amount () {
            let n = 0;
            let member = this.$store.state.common.memberInfo;
            if(member.cards&&member.cards.length){
                member.cards.forEach(e=>{
                    n+=parseFloat(e.given_amount);
                })
            }
            return parseFloat(n);
        },
        hasGiveAmount () {
            return isNaN(this.give_amount)&&parseFloat(this.give_amount)>0;
        },
        cardZk () {
            let n = '';
            let member = this.$store.state.common.memberInfo;
            if(member.cards&&member.cards.length){
                n = member.cards[0].name+""+(parseFloat(member.cards[0].discount_amount_for_service_item)/10).toFixed(1)+"折";
            }
            return n;
        },
        ...mapState({
            zaoxinshi: state => state.appointment.zaoxinshi,
            order: state => state.appointment.order,
            store: state => state.appointment.store,
            appointment_start_at: state => state.appointment.order.appointment_start_at,
            couponList: state => state.common.couponList,
            mobile: state => state.common.member.mobile,
            address: state => state.appointment.store.address,
            couponList: state => state.common.avaliableCouponList,
            currentGiveAmount: state => state.appointment.give_amount
        })        
    }, 
    mounted () {
        this.$store.dispatch('getCoupon',{});
    },   
    components: {
        Group,
        Cell,
        XButton,
        Flexbox,
        FlexboxItem,
        ViewBox
    }    
}
</script>

<style lang="less">
    .yyinfo{
        padding: 10px;
        color: #777;
        .title{
            margin-right: 2em;
            color: #333;
        }
        line-height: 2em;
        background:#fff;
    }
    .zxs-select{
        height: 70px;
        box-sizing: border-box;
        background:#fff;
        .vux-flexbox{
            height: 100%;
        }
    }
    .zxs-select-ava{
        box-sizing: border-box;
        text-align: center;
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid #fdfdfd;
            margin-top:7px;
        }
    }
</style>
