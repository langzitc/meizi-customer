<template>
    <div class="common-wrap">
        <group :gutter="0">
            <cell-box v-for="(item,index) in data" :key="index">
                <div slot="default" style="width:100%">
                    <div class="mcoi-cell">
                        <div class="mcoi-cell-item mcoi-cell-left">{{item.description}}</div>
                        <div class="mcoi-cell-item mcoi-cell-right">-￥{{item.grand_total}}</div>
                    </div>
                    <div class="mcoi-cell mcoi-cell-desc">
                        <div class="mcoi-cell-item mcoi-cell-left">{{item.updated_at}}</div>
                        <div class="mcoi-cell-item mcoi-cell-right">余额：￥47</div>                        
                    </div>                    
                </div>
            </cell-box>                      
        </group>
        <msg v-if="!data.length" icon="warn" title="温馨提示" description="您还没有账单"></msg>        
        <foot></foot>  
    </div>
</template>

<script>
import { CellBox, Group, Msg } from 'vux' 
import { mapState } from 'vuex'
export default {
    name: 'member-card-accountinfo',
    data () {
        return {
            params: {
                page: 1,
                page_size: 10,
                customer_order_status: 3
            },
            data: []
        }
    },
    methods: {
        getList () {
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });             
            this.$http.post('/shop/customer/order/list',this.params).then(res=>{
                this.data = res.data.items;
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                 
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                 
            })
        }
    },
    components: {
        CellBox,
        Group,
        Msg
    },
    mounted () {
        this.getList();
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
