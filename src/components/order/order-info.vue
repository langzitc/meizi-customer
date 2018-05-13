<template>
    <div class="common-wrap order-info common-view-box">
        <view-box>
            <group :gutter="0">
                <cell>
                    <span slot="title">订单状态</span>
                    <span slot="default">
                        {{data.status_label}}
                    </span>
                </cell>
                <cell>
                    <span slot="title">支付状态</span>
                    <span slot="default">
                        {{data.payment_status_label}}
                    </span>
                </cell>            
                <cell>
                    <span slot="title">预约时间</span>
                    <span slot="default" v-if="data.pre_order">
                        {{data.pre_order.appointment_start_at}}
                    </span>
                </cell>    
                <cell>
                    <div slot="icon" class="circle-img" style="margin-right:15px">
                        <img src="../../../static/avatar.png" alt="">                    
                    </div>
                    <span slot="title">{{zaoxingshi.name}}</span>
                    <x-icon type="android-call" size="30" @click.native="tel"></x-icon>
                </cell>                      
            </group>   
            <group :gutter="5" style="background:#fff">
                <cell>
                    <div slot="title">
                        <p>{{store.name}}</p>
                        <p class="text-muted" style="font-size:0.8em">{{store.full_address}}</p>
                    </div>
                </cell>
                <cell>
                    <div slot="title" class="map-container" id="map-container"></div>
                </cell>            
            </group>
            <group title="消费项目" :gutter="0" style="background:#fff" v-if="data.items" v-for="(el,index) in data.items" :key="index">
                <cell>
                    <span slot="title">{{el.product_name}}</span>
                    <span slot="default" class="text-default">
                        ￥{{el.row_total | money}}
                    </span>
                </cell> 
                <cell>
                    <div slot="default" style="width:300px;">
                        <flexbox justify="flex-end">
                            <flexbox-item :span="1/4" class="text-right">
                                合计:
                            </flexbox-item>
                            <flexbox-item :span="1/4" class="text-right text-default">
                                ￥{{data.grand_total | money}}
                            </flexbox-item>
                        </flexbox>
                        <flexbox justify="flex-end" class="text-amount">
                            <flexbox-item :span="2/4" class="text-right" v-if="cardZk">
                                <span class="tag tag-primary" style="padding: 5px">{{cardZk}}</span>
                            </flexbox-item>                    
                            <flexbox-item :span="1/4" class="text-right">
                                折扣价:
                            </flexbox-item>
                            <flexbox-item :span="1/4" class="text-right text-amount">
                                ￥{{zkj | money}}
                            </flexbox-item>
                        </flexbox>                
                    </div>
                </cell>                               
            </group>  
            <group title="付款明细" :gutter="0" style="background:#fff">
                <cell v-for="(el,index) in data.payments" v-if="data.payments" :key="index">
                    <span slot="title">{{getPayTitle(el)}}</span>
                    <span slot="default" class="text-default">
                        ￥{{el.amount | money}}
                    </span>
                </cell>                   
            </group>   
            <group :gutter="5">
                <cell>
                    <span slot="title">订单编号</span>
                    <span slot="default">{{data.trans_number}}</span>
                </cell>
                <cell>
                    <span slot="title">创建时间</span>
                    <span slot="default">
                        {{data.created_at}}
                    </span>
                </cell>                     
            </group>  
            <group :gutter="5">
                <cell>
                    <div style="width:100%" slot="title" class="text-right"> 
                        <x-button :link="{name:'order_talk',query:{id: data.id}}" v-if="data.order_type == 0 && data.is_reviewed == 0 && data.status === 'completed'">评价</x-button>
                        <x-button link="order_tklc" v-if="data.order_type == 0 && data.status === 'refund'">退款流程</x-button>
                        <x-button type="primary" link="appointment_time" v-if="data.order_type == 0 && data.status === 'completed'">再次预约</x-button>        
                    </div>
                </cell>                  
            </group>   
            <foot></foot>             
        </view-box>
        <div class="common-foot-tab" v-if="data.payment_status == 0">
            <flexbox>
                <flexbox-item :span="2/3">
                    <span>还需支付</span>
                    <span class="text-primary" style="font-size:16px">￥{{getWaitPayAmount | money}}</span>                    
                </flexbox-item>   
                <flexbox-item class="text-right" :span="1/3">
                    <x-button :link="{name: 'appointment_pay',query: {id: data.id}}" type="primary">立即支付</x-button>
                </flexbox-item>                     
            </flexbox>                    
        </div>                                        
    </div>
</template>

<script>
import { Group, Cell, Panel, XButton, Flexbox, FlexboxItem, ViewBox } from 'vux'
import until from '../../until'
export default {
    name: 'order-info',
    data () {
        return {
           data: {},
           zaoxingshi: {},
           store: {} 
        }
    },
    methods: {
        getPayTitle (el) {
            switch (el.method) {
                case 'MemberCardGivenAmount': 
                    return '赠送金';
                break;
                case 'MemberCardAmount': 
                    return '会员卡';
                break;
                case 'BonusCoupon': 
                    return '现金券';
                break;
                case 'Check': 
                    return '现金';
                break;
                case 'Alipay': 
                    return '支付宝';
                break;
                case 'WeChatPay': 
                    return '微信';
                break;
                default: 
                    return '套餐卡';
                break;    
            }
        },
        tel () {
            window.location.href = 'tel:'+this.zaoxingshi.mobile;
        }        
    },
    computed: {
        zkj () {
            return parseFloat(this.data.grand_total) - parseFloat(this.data.discount_amount);
        },
        cardZk () {
            let n = '';
            let member = this.$store.state.common.memberInfo;
            if(member.cards&&member.cards.length){
                n = member.cards[0].name+""+(parseFloat(member.cards[0].discount_amount_for_service_item)/10).toFixed(1)+"折";
            }
            return n;
        },
        getWaitPayAmount () {
            let n = 0;
            if(this.data.payments){
                this.data.payments.forEach(e=>{
                    if(e.method === 'ToBeDetermined'){
                        n+=parseFloat(e.amount);
                    }
                })
            }
            return n;
        }
    },
    components: {
        Group,
        Cell,
        XButton,
        Flexbox,
        FlexboxItem,
        ViewBox
    },
    mounted () {
        let query = this.$route.query;
        if(query.order_id){
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });   
            this.$http.post('/shop/customer/order/info',{
                order_id: query.order_id
            }).then(res=>{
                this.data = res.data;
                let employee_id = '',store_id = res.data.store_id;
                res.data.items.forEach(e=>{
                    if(e.employees&&e.employees.length){
                        employee_id = e.employees[0].employee_id;
                    }
                })
                this.$http.post("/public/batchRequest",[{
                    path: '/shop/employee/info',
                    data: {
                        id: employee_id                     
                    },
                    key: 'zxsinfo'                       
                },{
                    path: '/shop/store/storeInfo',
                    data: {
                        id: store_id                    
                    },
                    key: 'storeinfo'                      
                }]).then(res=>{
                    res.data.forEach(e=>{
                        if(e.key === 'zxsinfo'){
                            this.zaoxingshi = e.data.data;
                        }else if(e.key === 'storeinfo'){
                            this.store = e.data.data;
                            let pointArr = this.store.geo_location.split(',');
                            until.useMap().then(res=>{
                                let map, geolocation;
                                map = new AMap.Map('map-container', {
                                    resizeEnable: true,
                                    zoom: 13,
                                    zoomEnable: true,
                                    dragEnable: true,
                                    scrollWheel: true,
                                    center: pointArr
                                });   
                                let infoWindow = new AMap.InfoWindow({
                                    content: `<h3>${this.store.name}</h3><p>${this.store.address}</p>`,
                                    offset: new AMap.Pixel(0, -20)
                                });                                 
                                let marker = new AMap.Marker({
                                    position: pointArr,
                                    title: this.store.name,
                                    map
                                });    
                                infoWindow.open(map, pointArr);                                                            
                            })                              
                        }
                    })                    
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                     
                }).catch(e=>{
                    this.$store.commit('updateLoadingStatus',{
                        isLoading: false
                    });                     
                })                
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
    .map-container{
        width: 100%;
        height: 200px;
    }
    .order-info{
        .weui-cells__title{
            margin-top: 0.43em;
            padding-top: 5px;
            font-size: 0.8em;
        }
    }
</style>
