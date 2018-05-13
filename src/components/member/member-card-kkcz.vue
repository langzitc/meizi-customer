<template>
    <div class="common-wrap common-view-box">
        <view-box>
            <group :gutter="0" style="background:#fff;margin-top:0.4em;">
                <p slot="title" class="text-muted" style="font-size:0.8em;margin-left:15px;padding: 15px 0">请选择充值开卡金额</p>
                <checker
                v-model="select_item"
                selected-item-class="kkcz-item-selected"
                :max="1"
                radio-required
                >
                    <checker-item v-for="item in formatData" :key="item.id" :value="item.id" style="width:100%">
                        <div class="kkcz-ckitem">
                            <div class="kkcz-cileft">
                                <check-icon :value="item.id === select_item"></check-icon>
                            </div>
                            <div class="kkcz-ciright">
                                <div class="card-item">
                                    <div class="card-item-left">
                                        <div style="font-size:30px">￥{{item.price | money_int}}</div>
                                        <div>{{item.name}}</div>
                                    </div>
                                    <div class="card-item-right">
                                        <p class="text-muted">充值特权</p>
                                        <p>享受服务项目{{item.discount_amount_for_service_item | zhekou}}折优惠</p>
                                        <p>额外获得￥{{item.given_amount | money_int}}赠送金</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </checker-item>
                </checker>             
            </group>  
            <foot></foot>            
        </view-box>
        <div class="common-foot-tab">
            <x-button type="primary" :show-loading="loading" @click.native="chongzhi">{{btnText}}</x-button>
        </div>
    </div>
</template>

<script>
import { Checker, CheckerItem, Group, CheckIcon, XButton, ViewBox } from 'vux'
import { mapState } from 'vuex'
export default {
    name: 'member-card-kkcz',
    data () {
        return {
            select_item: '',
            loading: false,
            cardList: []
        }
    },
    computed: {
        btnText () {
            if(this.$store.state.common.memberInfo.cards&&this.$store.state.common.memberInfo.cards.length){
                return '立即充值';
            }else{
                return '立即开卡';
            }
        },
        formatCardList () {
            let amount = 0;
            let arr = this.cardList.filter(e=>{
                return e.id === this.product_id;
            })
            if(arr.length){
                amount = arr[0].min_recharge_amount;
            }
            return this.cardList.filter(e=>{
                return e.min_recharge_amount>amount||e.min_recharge_amount === amount;
            })
        },
        formatData () {
            return this.formatCardList.map((e,i)=>{
                let flag = i === 0;
                return {
                    id: e.id,
                    name: e.name,
                    selected: flag,
                    price: e.min_recharge_amount,
                    given_amount: e.given_amount,
                    discount_amount_for_service_item: e.discount_amount_for_service_item
                }
            })
        },
        product_id () {
            let id = '';
            if(this.memberInfo.cards&&this.memberInfo.cards.length){
                id = this.memberInfo.cards[0].product_id;
            }
            return id;
        },
        ...mapState({
            memberInfo: state => state.common.memberInfo
        })        
    },
    methods: {
        chongzhi () {
            let d = this.formatData.filter(e=>{
                return e.id === this.select_item;
            });
            if(d.length){
                this.$store.commit('setCzkk',d[0]);
                this.$router.push({
                    name: 'member_card_ordersure'
                });
            }else{
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择您要开通的卡片或充值金额'
                })                 
            }
        }
    },
    mounted () {
        this.$http.post('/shop/customer/memberCard/cardAmountList').then(res=>{
            this.cardList = res.data;
        })
    },
    components: {
        CheckerItem,
        Checker,
        Group,
        CheckIcon,
        XButton,
        ViewBox
    }
}
</script>

<style lang="less">
    .kkcz-ckitem{
        display: flex;
        width: 100%;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 15px;
        box-sizing: border-box;
        .kkcz-cileft{
            width: 60px;
            line-height: 120px;
        }
        .kkcz-ciright{
            width: 100%;
            height: 120px;
            border: 1px solid #ddd;
            padding: 15px;
            box-sizing: border-box;
            .card-item{
                width: 100%;
                height: 100%;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                .card-item-left{
                    width: 170px;
                    text-align: center;
                    box-sizing: border-box; 
                    padding-right: 15px;
                }
                .card-item-right{
                    width: 100%;
                    border-left: 1px dashed #777;
                    padding-left: 15px;
                    box-sizing: border-box;
                    font-size: 0.8em;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-direction: column;
                }
            }
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
    .kkcz-item-selected{
        .kkcz-ciright{
            border: 1px solid #891E47;
        }
    }
</style>
