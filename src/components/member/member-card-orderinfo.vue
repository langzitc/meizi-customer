<template>
    <div class="common-wrap common-view-box">
        <view-box>
            <group :gutter="0">
                <cell>
                    <span slot="title" class="text-muted">订单状态</span>
                    <span class="text-amount" slot="default">{{orderStatus}}</span>
                </cell>   
                <cell>
                    <span slot="title" class="text-muted">消费时间</span>
                    <span slot="default">{{xfsj}}</span>
                </cell>                                  
            </group>
            <group :gutter="0" style="background:#fff;margin-top:0.4em;">
                <p slot="title" class="text-muted" style="font-size:0.8em;margin-left:15px;padding: 15px 0">消费项目</p>
                <cell :title="item.product_name" v-if="data.items" v-for="(item,index) in data.items" :key="index">
                    <span slot="default">￥{{item.price}}</span>
                </cell>   
                <cell>
                    <span slot="default" class="text-amount">
                        合计：&nbsp;&nbsp;￥{{data.grand_total}}
                    </span>
                </cell>                                  
            </group>   
            <group :gutter="0" style="background:#fff;margin-top:0.4em;">
                <p slot="title" class="text-muted" style="font-size:0.8em;margin-left:15px;padding: 15px 0">付款明细</p>
                <cell :title="payTitle(item.method)" v-if="data.payments" v-for="(item,index) in data.payments" :key="index">
                    <span slot="default">￥{{item.amount}}</span>
                </cell>                                  
            </group>   
            <group :gutter="5">
                <cell title="订单编号">
                    <span slot="default">{{data.trans_number}}</span>
                </cell>   
                <cell title="创建时间">
                    <span slot="default">{{data.created_at}}</span>
                </cell>                                              
            </group>    
            <foot></foot>            
        </view-box>
        <div class="common-foot-tab" v-if="data.status === 'processing'">
            <group :gutter="0">
                <cell>
                    <div slot="title" style="width:100%">
                        <flexbox>
                            <flexbox-item>
                                <span>还需支付</span>
                                <span class="text-primary" style="font-size:16px">￥{{data.grand_total}}</span>                    
                            </flexbox-item>   
                            <flexbox-item class="text-right">
                                <x-button link="appointment_pay" :show-loading="loading" type="primary" mini>立即支付</x-button>
                            </flexbox-item>                     
                        </flexbox>                    
                    </div>
                </cell>            
            </group>   
        </div>                           
    </div>
</template>

<script>
import { Cell, Group, Flexbox, FlexboxItem, XButton, dateFormat, ViewBox } from 'vux' 
export default {
    name: 'member-card-orderinfo',
    data () {
        return {
           data: {},
           loading: false 
        }
    },
    components: {
        Cell,
        Group,
        Flexbox,
        FlexboxItem,
        XButton,
        ViewBox
    },
    methods: {
        payTitle (type){
            let str = '';
            switch(type){
                case 'Check': 
                    str = '现金';
                break;
                case 'Alipay': 
                    str = '支付宝'
                break;
                case 'WeChatPay': 
                    str = '微信';
                break;
                case 'CreditCard': 
                    str = '信用卡';
                break;
            }
            return str;
        }        
    },
    computed: {
        orderStatus () {
            let str = '';
            if(this.data.id){
                switch(this.data.status){
                    case 'processing': 
                        str = '待支付';
                    break;
                    case 'completed': 
                        str = '已完成';
                    break;
                    case 'canceled': 
                        str = '已取消';
                    break;
                    case 'refund': 
                        str = '退款';
                    break;
                }
            }
            return str;
        },
        xfsj () {
            return dateFormat(this.data.created_at,'YYYY-MM-DD');
        }
    },
    mounted () {
        let query = this.$route.query;
        if(query.id){
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });             
            this.$http.post('/shop/customer/order/info',{
                order_id: query.id
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
            this.$router.go(-1);
        }
    }
}
</script>

<style lang="less">
    .mcoi-cell{
        width: 100%;
        display: flex;
        justify-content: space-between;
        &.mcoi-cell-desc{
            color: #777;
            font-size: 0.8em;
        }
        .mcoi-cell-right{
            text-align: right;
        }
    }
    .mcoi-cell-item{
        
    }
</style>
