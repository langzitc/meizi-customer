<template>
    <div class="common-wrap">
        <msg v-if="!hasCard" icon="warn" title="温馨提示" description="您还没有会员卡，请开卡" :buttons="buttons"></msg>
        <div class="hyk-wrap" v-if="hasCard">
            <div class="hyk-top">
                <div class="hyk-top-card">
                    <div class="hyk-top-card-box">
                        <flexbox>
                            <flexbox-item>会员卡余额</flexbox-item>
                            <flexbox-item class="text-right">
                                <span class="tag-card">
                                    <micon name="bjhy" scale="1.5" style="vertical-align: text-bottom"></micon>
                                    {{card.name}}
                                </span>
                            </flexbox-item>
                        </flexbox>
                        <flexbox style="margin-top:20px;">
                            <flexbox-item style="font-size:1.8em;">￥{{card.amount | money}}</flexbox-item>
                            <flexbox-item class="text-right text-elips">
                                no.{{card.number}}
                            </flexbox-item>
                        </flexbox>    
                        <div style="border-top:1px solid #000;padding-top:20px;margin-top:20px">
                            赠送金:&nbsp;&nbsp;￥{{card.given_amount | money}}
                        </div>                    
                    </div>
                </div>
            </div>
            <div class="hyk-bottom">
                <div class="info">
                    <p>开卡日期：{{kkrq}}</p>
                    <p>过期日期：{{gqrq}}</p>
                    <p>会员权益：{{hyqy}}</p>
                </div>
                <x-button type="primary" link="member_card_kkcz">充值</x-button>
                <x-button type="default" link="member_card_accountinfo">账单明细</x-button>
            </div>            
        </div>
    </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Msg, dateFormat } from 'vux'
import { mapState } from 'vuex'
export default {
    name: 'member-card',
    data () {
        return {
            buttons: [{
                type: 'primary',
                text: '立即开卡',
                link: 'member_card_kkcz'
            },{
                type: 'default',
                text: '返回',
                onClick: ()=>{
                    this.$router.go(-1);
                }
            }]
        }
    },
    computed: {
        hasCard () {
            return this.memberInfo.cards&&this.memberInfo.cards.length > 0;
        },
        card () {
            let card = {};
            if(this.memberInfo.cards&&this.memberInfo.cards.length){
                card = this.memberInfo.cards[0];
            }
            return card;
        },
        kkrq () {
            let str = '';
            if(this.card.created_at){
                str = dateFormat(this.card.created_at,'YYYY-MM-DD');
            }
            return str;
        },
        gqrq () {
            let str = '永久有效';
            if(this.card.expired_at){
                str = dateFormat(this.card.expired_at,'YYYY-MM-DD');
            }
            return str;
        },
        hyqy () {
            let tczk = '0',xmzk = '0';
            if(this.card.discount_amount_for_service_group){
                tczk = parseFloat(this.card.discount_amount_for_service_group).toFixed(1);
                xmzk = parseFloat(this.card.discount_amount_for_service_item).toFixed(1);
            }
            return `项目消费${xmzk}折,套餐消费${tczk}折`
        },
        ...mapState({
            memberInfo: state => state.common.memberInfo
        })
    },
    components: {
        XButton,
        Flexbox,
        FlexboxItem,
        Msg
    }
}
</script>

<style lang="less">
    .hyk-wrap{
        height: 100%;
        position: relative;
        padding-top: 250px;
        box-sizing: border-box;
        .hyk-top{
            height: 250px;
            position: absolute;
            left: 0;
            top: 0;
            background: #000;
            padding: 15px;
            box-sizing: border-box;
            width: 100%;
            overflow: hidden;
            .hyk-top-card{
                background: url(../../../static/bg.png) no-repeat;
                width: 100%;
                height: 100%;
                border-radius: 10px;
                box-shadow: 0 0px 3px 5px rgba(255,255,255,.1);
                position: relative;
                bottom: -25px;
                .hyk-top-card-box{
                    width: 100%;
                    height: 100%;  
                    background-color: #EBC959;
                    opacity: .96;    
                    border-radius: 10px;       
                    padding: 25px 15px;
                    box-sizing: border-box;       
                }
            }
        }
        .hyk-bottom{
            height: 100%;
            padding: 15px;
            box-sizing: border-box;
            .info{
                padding: 30px 0;
                font-size: 0.8em;
            }
        }        
    }
    .tag-card{
        background-color: #000;
        display: inline-block;
        padding: 0px 5px;
        border-radius: 15px;
        color: #EBC959;
        font-size: 0.8em;
    }
</style>
