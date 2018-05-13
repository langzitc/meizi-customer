<template>
    <div class="common-wrap common-view-box">
        <view-box>
            <group :gutter="0" style="background:#fff;margin-top:0.4em;">
                <p slot="title" class="text-muted" style="font-size:1.2em;margin-left:15px;padding: 15px 0">{{czkk.name}}</p>
                <cell title="充值金额">
                    <span slot="default">￥{{czkk.price}}</span>
                </cell>  
                <cell title="赠送金">
                    <span slot="default">￥{{czkk.given_amount}}</span>
                </cell>               
                <cell>
                    <span slot="default" class="text-amount">
                        合计：&nbsp;&nbsp;￥{{czkk.price}}
                    </span>
                </cell>                                  
            </group>      
            <foot></foot>         
        </view-box>
        <div class="common-foot-tab">
            <group :gutter="0">
                <cell>
                    <div slot="title" style="width:100%">
                        <flexbox>
                            <flexbox-item>
                                <span>需付款</span>
                                <span class="text-primary" style="font-size:16px">￥{{czkk.price}}</span>                    
                            </flexbox-item>   
                            <flexbox-item class="text-right">
                                <x-button @click.native="submit" :show-loading="loading" type="primary" mini>提交订单</x-button>
                            </flexbox-item>                     
                        </flexbox>                    
                    </div>
                </cell>            
            </group>   
        </div>                
    </div>
</template>

<script>
import { Group, Cell, XButton, Flexbox, FlexboxItem, ViewBox } from 'vux'
import { mapState } from 'vuex'
export default {
    name: 'member-card-ordersure',
    data () {
        return {
            loading: false
        }
    },
    computed: {
        ...mapState({
            czkk: state => state.appointment.czkk
        })
    },
    components: {
        Group,
        Cell,
        XButton,
        Flexbox,
        FlexboxItem,
        ViewBox
    },
    methods: {
        submit () {
            let url = this.$store.state.common.memberInfo.cards&&this.$store.state.common.memberInfo.cards.length ? 
            '/shop/customer/memberCard/recharge' : 
            '/shop/customer/memberCard/addCard';
            this.loading = true;
            this.$http.post(url,{
                product_id: this.czkk.id
            }).then(res=>{
                this.loading = false;
                this.$vux.alert.show({
                    title: '提示',
                    content: res.message,
                    onHide: ()=>{
                        this.$store.commit('setActualOrder',res.data);
                        location.href="/pay/index/?id=" + res.data.id;
                        console.log(res.data.id);
                        return;                        
                        this.$router.push({
                            name: 'appointment_pay',
                            query: {
                                id: res.data.id
                            }
                        })
                    }
                });                  
            }).catch(e=>{
                this.$vux.alert.show({
                    title: '提示',
                    content: '下单失败'
                });                  
                this.loading = false;
            })
        }
    },
    mounted () {
        if(!this.czkk.id){
            this.$router.push({
                name: 'member_card_kkcz'
            })
        }
    }
}
</script>

<style>

</style>

