<template>
    <div class="common-wrap">
        <div style="background:#fff;padding:15px 15px 15px 30px;box-sizing: border-box;">
            <div class="tklc-box">
                <div class="tklc-item ck1">
                    <div class="tklc-item-title">退款中</div>
                    <p class="tklc-item-desc">
                        提交退款申请后，您的订单将处于‘退款中’的状态，客服将在申请提交后的2-3个工作日内处理您的退款申请；客服人员可能会致电与您确认退款情况。
                    </p>
                </div>
                <div class="tklc-item ck2">
                    <div class="tklc-item-title">退款完成</div>
                    <p class="tklc-item-desc">
                        客服核实退款申请后，您的订单状态将更新为‘已退款’，以表示申请成功。您的退款金额将在5个工作日内返回至您的支付账户，若您使用了会员卡支付，请查看您的会员卡余额，
                        如使用了奖金券/套餐券，将退回账户。
                    </p>
                </div>            
            </div>
            <div style="margin: 20px 0">
                <p class="text-center" style="font-size:0.8em">如有其它异常，清联系客服</p>
                <div class="od-btnbox">
                    <x-button class="lxkf">联系客服</x-button>
                </div>            
            </div>            
        </div>
        <foot></foot>  
    </div>
</template>

<script>
import { XButton } from 'vux'
export default {
    name: 'order-tklc',
    data () {
        return {
            
        }
    },
    components: {
        XButton
    }
}
</script>

<style lang="less">
    .od-btnbox{
        text-align: center;
        margin-top:20px;
        .lxkf{
            background-color:#fff;
            border: 1px solid #891E47;
            color: #891E47;
            width: 150px;                
        }
    }
    .tklc-box{
        width: 100%;
        padding-left: 50px;
        box-sizing: border-box;
        border-left: 1px solid #ddd;
        .tklc-item{
            position: relative;
            .tklc-item-title{
                font-size: 16px;
                color: #777;
                &.active{
                    color: #891E47;
                }
            }
            .tklc-item-desc{
                font-size: 0.8em;
                padding: 15px 0;
            }
            &:before{
              display: block;  
              width: 25px;
              height: 25px;
              border-radius: 15px;
              text-align: center;
              line-height: 25px;
              font-size: 0.8em;
              position: absolute;
              left: -62px;
              top: 0;
              color: #fff; 
            }
            &.ck1:before{
                content: '1';
                background: #891E47;               
            }
            &.ck2:before{
                content: '2';
                background: #777;              
            }            
        }
    }
</style>
