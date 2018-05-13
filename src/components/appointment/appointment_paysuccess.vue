<template>
    <div class="common-wrap paysuccess-box text-center">
        <p style="margin-top:50px"><icon type="success" is-msg></icon></p>
        <p style="font-size: 26px;margin-top:20px">支付成功</p>
        <p>订单已支付成功：￥{{amount}}</p>
        <flexbox style="margin-top:50px">
            <flexbox-item class="text-center">
                <x-button type="primary" @click.native="next" class="btn-l">继续预约</x-button>
            </flexbox-item>
            <flexbox-item class="text-center">
                <x-button type="default" @click.native="info" class="btn-r">查看订单详情</x-button>
            </flexbox-item>            
        </flexbox>   
        <foot></foot>      
    </div>
</template>

<script>
import { Icon, Flexbox, FlexboxItem, XButton } from 'vux'
export default {
    name: 'appointment_paysuccess',
    data () {
        return {
            id: '',
            amount: 0
        }
    },
    methods: {
        next () {
            this.$router.push({
                name: 'home'
            });
        },
        info () {
            this.$router.push({
                name: 'order_info',
                query: {
                    order_id: this.id
                }
            });
        }
    },
    components: {
        Icon,
        Flexbox,
        FlexboxItem,
        XButton
    },
    mounted () {
        let query = this.$route.query;
        if(query.id&&query.amount){
            this.amount = query.amount;
            this.id = query.id;
        }else{
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="less">
    .paysuccess-box{
        height: 100%;
        background-color: #fff;
        box-sizing: border-box;
        .btn-l{
            width: 80%;
        }
        .btn-r{
            background-color:#fff;
            border: 1px solid #891E47;
            color: #891E47;
            width: 70%;
            box-sizing: border-box;
        }
    }
</style>
