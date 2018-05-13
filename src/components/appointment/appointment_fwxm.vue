<template>
    <div class="common-wrap fwxm-box">
        <view-box>
                <group :gutter="0">
                    <cell title="到店时间">
                        <span slot="default" style="color:#000">{{appointment_start_at}}</span>
                    </cell>
                </group>                                                              
                <div style="margin-top:5px;background:#fff">
                    <group :gutter="5">
                        <cell :is-link="true" v-for="el in list" :key="el.id" v-bind:class="el.activated ? 'activated' : ''" @click.native="el.showPopup = true">
                            <div slot="title" style="width:100%">
                                <flexbox>
                                    <flexbox-item>
                                        <span class="span-l">{{el.name}}</span>
                                    </flexbox-item>
                                    <flexbox-item class="text-right">
                                        <span class="span-r">￥{{showPrice(el) | money}}</span>
                                    </flexbox-item>
                                </flexbox>
                                <flexbox v-for="(el2,index) in el.items" :key="index" v-if="el2.checked" style="padding-left:20px;box-sizing:border-box;margin-top:15px">
                                    <flexbox-item class="text-elips">
                                        <span class="text-muted">{{showChildName(el2)}}</span>
                                    </flexbox-item>
                                    <flexbox-item class="text-right">
                                        <span class="text-muted">￥{{showChildPrice(el2) | money}}</span>
                                    </flexbox-item>
                                </flexbox>                                
                            </div>
                            <div v-transfer-dom>
                                <popup v-model="el.showPopup" height="60%"  :popup-style="{overflow: 'scroll','-webkit-overflow-scrolling': 'touch',backgroundColor:'#fff'}">
                                    <div class="popup-fwxm-wrap">
                                        <div class="popup-fwxm">
                                            <div class="popup-fwxm-h">
                                                <div class="popup-fwxm-h-r">
                                                    <h3>{{el.name}}</h3>
                                                    <p class="text-muted text-elips">{{el.description}}</p>
                                                </div>
                                                <div class="img-wrap">
                                                    <img src="../../../static/avatar2.png" alt="">                            
                                                </div>
                                            </div>
                                            <group :gutter="0" v-if="el.items" v-for="el2 in el.items" :key="el2.id">
                                                <cell @click.native="checkChange('parent',el2)">
                                                    <flexbox slot="title" class="parent">
                                                        <flexbox-item :span="1/6">
                                                            <check-icon :value.sync="el2.checked"></check-icon>
                                                        </flexbox-item> 
                                                        <flexbox-item :span="5/6">
                                                            {{el2.name}}
                                                        </flexbox-item>
                                                    </flexbox>
                                                    <span class="text-amount" slot="default">￥{{getProductPrice(el,el2)| money}}</span>
                                                </cell>
                                                <flexbox  v-if="el2.advanced_prices.length&&el2.checked" v-for="el3 in el2.advanced_prices" :key="el3.id" class="children" @click.native="checkChange('children',el2,el3)">
                                                    <flexbox-item :span="1/2">
                                                        <check-icon :value.sync="el3.checked"></check-icon>
                                                        <span>{{el3.attributes[el3.attr_key()].label}}</span>
                                                    </flexbox-item>                                 
                                                    <flexbox-item :span="1/2" class="text-right" v-show="el3.checked">
                                                        <span class="text-amount">￥{{el3.price | money}}</span>
                                                    </flexbox-item>                                
                                                </flexbox>                     
                                            </group>
                                            <x-button type="primary" style="position:fixed;left: 0;bottom:5px" @click.native="sureFwxm(el)">确认</x-button>
                                        </div>                    
                                    </div>
                                </popup>   
                            </div>                      
                        </cell>                                                    
                    </group>            
                </div>                      
        </view-box>        
        <div class="common-foot-tab">
            <flexbox :gutter="0">
                <flexbox-item v-show="priceData.length" :span="2/3">
                    <span class="text-old-amount" style="margin-right:5px">总价￥{{origin_price | money}}</span>
                    <span>会员价</span>
                    <span class="text-primary" style="font-size:16px">￥{{final_price | money}}</span>                    
                </flexbox-item>  
                <flexbox-item v-show="!priceData.length" :span="2/3">
                    <span class="text-muted">请选择项目</span>                
                </flexbox-item>                   
                <flexbox-item class="text-right" :span="1/3">
                    <x-button type="primary" @click.native="sure">确定</x-button>
                </flexbox-item>                     
            </flexbox>
        </div>     
    </div>
</template>

<script>
import { Group, Cell, Flexbox, FlexboxItem, XButton, Popup, TransferDom, CheckIcon, ViewBox } from 'vux'
import { mapState, mapActions } from 'vuex'
import { setTimeout } from 'timers';
import Product from "../../model/Product";
import ProductCategory from "../../model/ProductCategory";
import List from "../../model/List";


export default {
    name: 'appointment_fwxm',
    directives: {
        TransferDom
    },    
    data () {
        let list = new List();
        return {
            list: [],
            priceData: [],
            serviceCategories: list
        }
    },
    methods: {
        showChildName (el) {
            let a = el.name;
            if(el.advanced_prices&&el.advanced_prices.length){
                let arr = el.advanced_prices.filter(e=>{
                    return e.checked;
                })
                if(arr.length){
                    a+=`(${arr[0].attributes[arr[0].attr_key()].label})`;
                }
            }
            return a;
        },
        showChildPrice (el) {
            let a = el.price;
            if(el.advanced_prices&&el.advanced_prices.length){
                let arr = el.advanced_prices.filter(e=>{
                    return e.checked;
                })
                if(arr.length){
                   a= arr[0].price;
                }
            }
            return a;
        },
        getProductPrice(categoryS,productS) {
            let category = this.serviceCategories.get("id",categoryS.id);
            let product = category.products.get("id", productS.id);
            let minPrice = product.getMinPrice();
            let maxPrice = product.getMaxPrice();
            if(minPrice == maxPrice) {
                return minPrice;
            }
            return minPrice + "起";
        },
        showPrice (el) {
            let category = this.serviceCategories.get("id",el.id);
            let minPrice = category.getMinPrice();
            let maxPrice = category.getMaxPrice();
            if(minPrice == maxPrice) {
                return minPrice;
            }
            return minPrice + "起";

            let str = el.price+"起";
            let price = 0;
            if(el.activated&&el.items&&el.items.length){
                el.items.forEach(el=>{
                    if(el.checked){
                        if(el.advanced_prices.length){
                            el.advanced_prices.forEach(el2=>{
                                if(el2.checked){
                                    price+=parseFloat(el2.price);
                                }
                            })
                        }else{
                            price+=parseFloat(el.price);
                        }
                    }
                })
                str = price;
            }
            return str;
        },
        sure () {
            let valid = false;
            this.$store.state.appointment.order.items.forEach(e=>{
                if(e.product_id){
                    valid = true;
                }
            })
            if(valid){
                this.$router.push({
                    name: 'appointment_confirm'
                });                
            }else{
                this.$vux.alert.show({
                    title: '提示',
                    content: `请选择服务项目`
                });                
            }
        },
        getList () {
            let items = this.$store.state.appointment.order.items;
            let setActivated = function (item) {
                let f = false;
                if(item.items&&item.items.length){
                    item.items.forEach(e2=>{
                        items.forEach(e=>{
                            if(e.product_id === e2.id){
                                f = true;
                            }
                        })                        
                    })
                }
                return f;
            }
            let setChecked = function (item){
                let f = false;
                if(item.advanced_prices&&item.advanced_prices.length){
                    let code = item.price_attributes_detail.map(e=>{
                        return e.code;
                    })
                    item.advanced_prices.forEach(e2=>{
                        items.forEach(e=>{
                            if(e.product_id === e2.product_id && e.attributes){
                                code.forEach(attr_key=>{
                                    if(e.attributes.length&&e.attributes[0][attr_key]&&e.attributes[0][attr_key] === e2.attributes[attr_key].value){
                                        f = true;
                                    }
                                })                                
                            }
                        })                          
                    })
                }else{
                    items.forEach(e=>{
                        if(e.product_id === item.id){
                            f = true;
                        }
                    })
                }
                return f;
            }
            let setChecked2 = function (item2,item){
                let f = false;
                if(item2.advanced_prices&&item2.advanced_prices.length){
                    let code = item2.price_attributes_detail.map(e=>{
                        return e.code;
                    })
                    items.forEach(e=>{
                        if(item.product_id === e.product_id && e.attributes){
                            code.forEach(attr_key=>{
                                if(e.attributes.length&&e.attributes[0][attr_key]&&e.attributes[0][attr_key] === item.attributes[attr_key].value){
                                    f = true;
                                }
                            })                                
                        }
                    })                    
                }                    
                return f;
            }
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });                          
            this.$http.post('/shop/service/serviceList',{
                store_id: this.store_id,
                employee_id: this.employee_id,
                type_code: 'service'
            }).then(res=>{
                let data = JSON.parse(JSON.stringify(res.data.items));
                let d = data.map(item=>{
                    let category = new ProductCategory();
                    category.parseJSONObject(item);
                    this.serviceCategories.add(category);

                    return {
                        id: item.id,
                        price: item.items[0].price,            
                        showPopup: false,
                        activated: setActivated(item),
                        name: item.name,
                        items: item.items.map((e,i)=>{
                            return {
                                id: e.id,
                                checked: setChecked(e),
                                name: e.name,
                                origin_price: e.origin_price,
                                price: e.price,
                                price_attributes_detail: e.price_attributes_detail,
                                advanced_prices: e.advanced_prices.map(e2=>{
                                    return {
                                        id: e2.id,
                                        product_id: e2.product_id,
                                        checked: setChecked2(e,e2),
                                        attributes: e2.attributes,
                                        price: e2.price,
                                        attr_key: (keys = e.price_attributes_detail,attr = e2.attributes)=>{
                                            let key = '';
                                            keys.forEach(e3=>{
                                                if(attr[e3.code]){
                                                    key = e3.code;
                                                }
                                            })
                                            return key;
                                        }                                        
                                    }
                                })                             
                            }
                        })                        
                    }
                })
                this.list = d;

                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                  
            }).catch(e=>{
                this.$store.commit('updateLoadingStatus',{
                    isLoading: false
                });                  
            })
        },
        init () {
            if(this.store_id&&this.employee_id){
                this.getList();
            }            
        },
        sureFwxm (el) {
            let valid = true;
            el.items.forEach(e=>{
                if(e.checked&&e.advanced_prices.length){
                    let ck = false;
                    e.advanced_prices.forEach(e2=>{
                        if(e2.checked){
                            ck = true;
                        }
                    })
                    if(!ck){
                        valid = false;
                    }
                }
            });
            if(!valid){
                this.$vux.alert.show({
                    title: '提示',
                    content: `请选择项目属性`
                });
                return false;                   
            }
            let items = [];
            let d = [];
            this.list.forEach(e=>{
                let flag = false;
                let arr = e.items.filter(e=>{
                    return e.checked;
                });
                if(arr.length){
                    flag = true;
                }
                d = d.concat(arr);
                e.activated = flag;
            })
            if(d.length){
                d.forEach(e=>{
                    let preorder = {};
                    preorder.product_id = e.id;
                    preorder.product_name = e.name;
                    preorder.origin_price = e.origin_price;
                    preorder.price = e.price;
                    preorder.employees = [{
                        employee_id: this.$store.state.appointment.zaoxinshi.id
                    }]
                    if(e.advanced_prices.length){
                        let d1 = e.advanced_prices.filter(e=>{
                            return e.checked;
                        })
                        if(d1.length){ 
                            let obj = {};
                            obj[d1[0].attr_key()] = d1[0].attributes[d1[0].attr_key()].value;
                            preorder.attributes = [obj];
                            preorder.$label = d1[0].attributes[d1[0].attr_key()].label;
                        }                  
                    }
                    items.push(preorder);                                        
                })
                this.$store.dispatch('updateOrder',{
                    items
                }).then(()=>{
                    this.getPrice(items); 
                });               
            }   
            el.showPopup = false;                 
        },
        checkChange (type,el,el2) {
            if(type === 'parent'){
                if(!el.checked&&el.advanced_prices.length){
                    el.advanced_prices.forEach(e=>{
                        e.checked = false;
                    })
                }
            }else{
                el2.checked = true
                el.advanced_prices.forEach(e=>{
                    if(e.id!==el2.id){
                        e.checked = false;
                    }
                })                
            }
        },
        getPrice (items) {
            this.$store.commit('updateLoadingStatus',{
                isLoading: true
            });  
            let requestData = [];
            items.forEach(e=>{
                requestData.push({
                    path: '/shop/checkout/calcProductPrice',
                    data: {
                        product_id: e.product_id,
                        employee_id: this.employee_id,
                        attributes: e.attributes&&e.attributes.length ? e.attributes[0] : {}                        
                    },
                    key: e.product_id
                });
            })            
            this.$http.post('/public/batchRequest',requestData).then(res=>{
                this.priceData = res.data;
                let orderItem = JSON.parse(JSON.stringify(this.$store.state.appointment.order.items));
                orderItem.forEach(e=>{
                    this.priceData.forEach(e2=>{
                        if(e2.key === e.product_id){
                            e.origin_price = e2.data.data.origin_price;
                            e.price = e2.data.data.final_price;
                        }
                    })
                })
                this.$store.dispatch('updateOrder',{
                    items: orderItem
                });                
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
    watch: {
        store_id () {
            this.init();
        },
        employee_id () {
            this.init();
        }
    },
    computed: {
        origin_price () {
          let n = 0;  
          this.priceData.forEach(e=>{
              n+=parseFloat(e.data.data.origin_price);
          })
          return n.toFixed(2);
        },
        final_price () {
          let n = 0;  
          this.priceData.forEach(e=>{
              n+=parseFloat(e.data.data.final_price);
          })
          return n.toFixed(2);
        },
        ...mapState({
            store_id: state => state.appointment.order.store_id,
            employee_id: state => state.appointment.zaoxinshi.id,
            appointment_start_at: state => state.appointment.order.appointment_start_at
        })        
    },
    mounted () {
        let items = this.$store.state.appointment.order.items;
        if(items.length&&items[0].product_id){
            this.getPrice(this.$store.state.appointment.order.items);
        }
        if(!this.store_id){
            this.$router.push({
                name: 'appointment_store'
            });
        }else if(!this.appointment_start_at){
            this.$router.push({
                name: 'appointment_time'
            });            
        }else if(!this.employee_id){
            this.$router.push({
                name: 'appointment_zxs'
            });            
        }else{
            this.init();
        }
    },
    components: {
        Group,
        Cell,
        XButton,
        Flexbox,
        FlexboxItem,
        Popup,
        CheckIcon,
        ViewBox
    }
}
</script>

<style lang="less">
    .fwxm-box{
        height: 100%;
        box-sizing: border-box;
        .weui-cell{
            padding: 14px 15px;
        }  
        .weui-tab .weui-tab__panel{
            padding-bottom: 30px;
        }
    }
    .popup-fwxm-wrap{
        width: 100%;
        background: rgba(0,0,0,.48);
        padding-top: 20px;
    }
    .popup-fwxm{
        width: 100%;
        padding: 0 15px 70px 15px;
        background: #fff;
        box-sizing: border-box;
        .popup-fwxm-h{
            width: 100%;
            height: 90px;
            padding-left: 120px;
            box-sizing: border-box;
            position: relative;
            .popup-fwxm-h-r{
                width: 100%;
                padding: 15px;
                box-sizing: border-box;
                p{
                    line-height: 40px;
                }
            }
            .img-wrap{
                position: absolute;
                width: 100px;
                height: 100px;
                border: 3px solid #fff;
                left: 0;
                top: -20px;
                background: #fff;
                border-radius: 3px;
                img{
                    width: 100px;
                    height: 100px;
                }
            }
        }
        .parent{
            .vux-label{
                font-size: 14px;
            }
            .weui-icon-success-circle{
                color: rgb(139, 27, 68);
                font-size: 18px;
            }
            .weui-icon-success{
                color: rgb(139, 27, 68);
                font-size: 18px;
            }   
            .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
                color: rgb(139, 27, 68);
                font-size: 18px;
            }  
            .weui-icon-circle{
                font-size: 18px;
            }            
        }
        .children{
            padding: 5px 25px 5px 15px;
            box-sizing: border-box;
            .vux-label{
                font-size: 14px;
            }
            .weui-icon-circle{
                font-size: 18px;
            }
            .weui-icon-success-circle{
                font-size: 18px;
            }
            .weui-icon-success{
                font-size: 18px;
            }   
            .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
                font-size: 18px;
            }              
        }       
    }
    .activated{
        .span-l,.span-r{
            color: #891E47;
        }
    }
</style>
