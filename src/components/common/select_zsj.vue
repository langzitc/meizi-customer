<template>
  <div class="common-wrap">
      <group :gutter="0" :title="groupTitle">
          <x-input title="赠送金" placeholder="输入赠送金" v-model="value"></x-input>
      </group>
      <div class="common-foot-tab">
          <x-button type="primary" @click.native="sure">确定</x-button>
      </div>
      <foot></foot>  
  </div>
</template>

<script>
import { Group, Cell, XInput, XButton } from 'vux'
export default {
    name: 'select_zsj',
    data () {
        return {
            give_amount: 0,
            price: 0,
            value: 0
        }
    },
    computed: {
        groupTitle () {
            return '可使用赠送金: '+this.give_amount+"元  ,订单金额: "+this.price+"元";
        }        
    },
    components: {
        Group,
        Cell,
        XInput,
        XButton
    },
    methods: {
        sure () {
            this.$store.commit('useGiveAmount',this.value);
            let payment_methods = this.$store.state.appointment.order.payment_methods;
            if(this.value>0){
                let flag = false;
                if(payment_methods.length){
                    payment_methods.forEach(e=>{
                        if(e.method === 'MemberCardGivenAmount'){
                            e.amount = this.value;
                            flag = true;
                        }
                    })
                }
                if(!flag){
                    payment_methods.push({
                        method: 'MemberCardGivenAmount',
                        amount: this.value
                    })
                }
            }else{
                payment_methods.forEach(e=>{
                    if(e.method === 'MemberCardGivenAmount'){
                        e.amount  = 0;
                    }
                })
                this.$store.dispatch('updateOrder',{
                    payment_methods
                })
            }
            this.$router.go(-1);
        }
    },
    mounted () {
        let query = this.$route.query;
        if(query.give_amount&&query.price){
            this.give_amount = parseFloat(query.give_amount);
            this.price = parseFloat(query.price);
            if(this.give_amount>this.price){
                this.value = this.price;
            }else{
                this.value = this.give_amount;
            }
        }
    }
}
</script>

<style>

</style>
