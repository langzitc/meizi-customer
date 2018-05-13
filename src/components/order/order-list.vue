<template>
    <div class="common-wrap order-list-box" style="padding-bottom:0">
        <tab v-model="tabIndex">
            <tab-item v-for="(item,index) in TabItem" :key="index">{{item}}</tab-item>
        </tab>
        <page-scroller
        ref="scroll"
        :scrollbar="scrollbarObj"
        :pullDownRefresh="pullDownRefreshObj"
        :pullUpLoad="pullUpLoadObj"
        :startY="parseInt(startY)"
        @pullingDown="onPullingDown"
        @pullingUp="onPullingUp"             
            >        
        <msg v-if="data.length === 0" icon="waiting" :title="tips"></msg>      
        <div style="height:100%;overflow:hidden" v-else>
            <group v-for="(item,index) in data" :key="index">
                <cell :link="{name:'order_info',query:{order_id: item.id}}">
                    <div slot="icon" class="circle-img" style="margin-right:15px;background:#891E47;width:40px;height:40px" v-if="item.order_type == 0">
                        <img src="../../../static/avatar.png" alt="">                    
                    </div>
                    <div slot="icon" class="circle-img" style="margin-right:15px;background:#891E47;width:40px;height:40px" v-if="item.order_type == 1">
                        <micon name="tag" scale="2.5" style="margin-top:10px;"></micon>                   
                    </div>      
                    <div slot="icon" class="circle-img" style="margin-right:15px;background:#891E47;width:40px;height:40px" v-if="item.order_type == 3 || item.order_type == 2">
                        <micon name="card-vip" scale="2.5" style="margin-top:10px;"></micon>                     
                    </div>                                
                    <span slot="title" v-if="item.order_type == 1">造型师</span>
                    <span slot="title" v-if="item.order_type != 1">{{item.description}}</span>
                    <span slot="default" v-bind:class="item.appointment_status == 0 ? 'text-amount' : 'text-muted'">
                        {{item.appointment_status_label}}
                    </span>                              
                </cell>    
                <cell-box :link="orderLink(item)">
                    <div>
                        <p class="order-list-item text-elips">
                            <span class="order-list-item-label">消费项目</span>
                            <span class="text-muted">
                                <span class="tag" v-for="item2 in item.items" :key="item2.id">{{item2.product_name}}</span>
                            </span>
                        </p>
                        <p class="order-list-item" v-if="item.order_type == 1">
                            <span class="order-list-item-label">预约时间</span>
                            <span class="text-muted">{{item.created_at}}</span>
                        </p>
                        <p class="order-list-item" v-if="item.order_type != 1">
                            <span class="order-list-item-label">消费时间</span>
                            <span class="text-muted">{{item.created_at}}</span>
                        </p>                    
                        <p class="order-list-item">
                            <span class="order-list-item-label">服务地点</span>
                            <span class="text-muted">{{item.store_address | limit(16)}}</span>
                        </p>                       
                    </div>                             
                </cell-box>
                <cell>
                    <span slot="title">
                        合计
                        <span class="text-amount" style="margin-left:20px">
                            ￥{{row_total(item)}}
                        </span>
                    </span>
                    <span slot="default" v-if="isZcyy(item)">
                        <x-button type="default" :link="{name: 'appointment_time',query: {order_id: item.id}}">
                            再次预约
                        </x-button>
                    </span>
                    <span slot="default" v-if="isPj(item)">
                        <x-button type="default" :link="{name: 'order_talk',query: {id: item.id}}">
                            评价
                        </x-button>
                    </span>
                    <span slot="default" v-if="isTklc(item)">
                        <x-button type="default" :link="order_tklc">
                            退款流程
                        </x-button>
                    </span>
                    <span slot="default" v-if="isLjzf(item)">
                        <x-button type="default" style="background:#000;color:#fff" :link="{name: 'appointment_pay',query: {id: item.id}}">
                            立即支付
                        </x-button>
                    </span>                                                
                </cell>
            </group>               
        </div>
        </page-scroller>  
    </div>
</template>

<script>
import { Tab, TabItem, Group, Cell, CellBox, XButton, Msg } from 'vux'
import PageScroller from '../common/page-scroller'
import { mapState } from 'vuex'
let _this,isChange = false;
export default {
    name: 'order-list',
    data () {
        return {
            tabIndex: 0,
            data: [],
            TabItem: ['全部','待消费','待评价','已完成','售后'],
            params: {
                page: 1,
                page_size: 10
            },
            scrollbar: true,
            scrollbarFade: true,
            pullDownRefresh: true,
            pullUpLoadMoreTxt: 'scrollComponent.defaultLoadTxtMore',
            pullUpLoadNoMoreTxt: 'scrollComponent.defaultLoadTxtNoMore',            
            pullDownRefreshThreshold: 90,
            pullDownRefreshStop: 40,
            pullUpLoad: true,
            pullUpLoadThreshold: 0,
            startY: 0,
            scrollToX: 0,
            scrollToY: -200,
            scrollToTime: 700,
            scrollToEasing: 'bounce',
            scrollToEasingOptions: ['bounce', 'swipe', 'swipeBounce'],              
        }
    },
    computed: {
        tips () {
            return `您暂时没有订单`;
        },
        scrollbarObj: function () {
            return this.scrollbar ? {fade: this.scrollbarFade} : false
        },
        pullDownRefreshObj: function () {
            return this.pullDownRefresh ? {
            threshold: parseInt(this.pullDownRefreshThreshold),
            stop: parseInt(this.pullDownRefreshStop)
            } : false
        },
        pullUpLoadObj: function () {
            return this.pullUpLoad ? {
            threshold: parseInt(this.pullUpLoadThreshold),
            txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
            } : false
        },         
        ...mapState({
            member: state => state.common.member
        })
    },
    watch: {
        tabIndex () {
            this.getList();
        },
        scrollbarObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        pullDownRefreshObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        pullUpLoadObj: {
            handler() {
                this.rebuildScroll()
            },
            deep: true
        },
        startY() {
            this.rebuildScroll()
        }         
    },
    methods: {
        isPj (item) {
            return item.is_reviewed == 0 && item.status === 'completed' && item.appointment_status == 1;
        },
        isZcyy (item) {
            return item.is_reviewed == 1 && item.status === 'completed' && item.appointment_status == 1;
        },
        isTklc (item) {
            return item.status === 'refund';
        },
        isLjzf (item) {
            return item.payment_status == 0;
        },
        row_total (item) {
            return parseFloat(item.grand_total).toFixed(2);
        }, 
        orderLink (item){
            return item.order_type == 0 || item.order_type == 1 ? 
            {name:'order_info',query:{order_id: item.id}} :
            {name:'member_card_orderinfo',query:{id: item.id}};
        },       
        getList (scroll,refresh=false) {
            return new Promise((resolve,reject)=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: true
                });  
                if(refresh){
                    this.params.page = 1;
                    this.params.limit = this.data.length;
                }else{
                    this.params.limit = 10;
                }                
                this.$http.post('/shop/customer/order/list',{
                    customer_order_status: this.tabIndex,
                    ...this.params
                }).then(res=>{
                    if(!scroll){
                        this.data = res.data.items;
                    }else{
                        this.data = this.data.concat(res.data.items);
                    }
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });
                    resolve(res.data.items.length === 0);                
                }).catch(e=>{
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    }); 
                    resolve();                 
                })                   
            })
        },
        scrollTo() {
            this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime, ease[this.scrollToEasing])
        },
        onPullingDown() {
            if(!isChange){
                isChange = true;
                this.getList(true,true).then(()=>{
                    this.$refs.scroll.forceUpdate();
                    isChange = false;
                }).catch(e=>{
                    isChange = false;
                })                
            }           
        },
        onPullingUp() {
            // 加载数据
            if(!isChange){
                isChange = true;
                this.params.page++;
                this.getList(true).then((flag)=>{
                    if(flag){
                        this.params.page--;
                    }
                    this.$refs.scroll.forceUpdate();
                    isChange = false;
                }).catch(()=>{
                    isChange = false;
                })                
            }
        },
        rebuildScroll() {
            Vue.nextTick(() => {
            this.$refs.scroll.destroy()
            this.$refs.scroll.initScroll()
            })
        },        
    },
    mounted () {
        this.getList();
    },
    components: {
        Tab,
        TabItem,
        Group,
        Cell,
        CellBox,
        XButton,
        Msg,
        PageScroller
    }
}
</script>

<style lang="less">
    .order-list-item-label{
        width: 80px;
        display: inline-block;
    }
    .order-list-item{
        line-height: 30px;
        .tag{
            margin-left: 0;
            margin-right: 5px;
            background-color: #999;
            color: #fff;
            padding: 5px 5px;
        }
    }
    .order-list-box{
        .weui-cell_access .weui-cell__ft:after,.weui-cell_access.vux-cell-box:after{
            display: none;
        }        
    }
</style>
