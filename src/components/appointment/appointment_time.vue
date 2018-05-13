<template>
    <div class="common-wrap common-view-box">          
        <view-box>
            <store-list :data="storeList" :isSingle="true"></store-list>
            <div style="background:#fff">
            <date-tab  @on-change="dateChange"></date-tab> 
            <divider>上午</divider>   
            <checker type="radio" v-model="selectTime" disabled-item-class="zdy-check-disabled" default-item-class="zdy-check" selected-item-class="zdy-check-selected" class="zdy-check-wrap">
                <checker-item :value="el" v-for="el in timeArr(1)" :key="el" :disabled="disableTime(el)">{{el}}</checker-item>
            </checker>              
            <divider>下午</divider>  
            <checker type="radio" v-model="selectTime" disabled-item-class="zdy-check-disabled" default-item-class="zdy-check" selected-item-class="zdy-check-selected" class="zdy-check-wrap">
                <checker-item :value="el" v-for="el in timeArr(2)" :key="el" :disabled="disableTime(el)">{{el}}</checker-item>
            </checker>           
            <divider>晚上</divider>     
            <checker type="radio" v-model="selectTime" disabled-item-class="zdy-check-disabled" default-item-class="zdy-check" selected-item-class="zdy-check-selected" class="zdy-check-wrap">
                <checker-item :value="el" v-for="el in timeArr(3)" :key="el" :disabled="disableTime(el)">{{el}}</checker-item>
            </checker>            
            </div>  
            <foot></foot>              
        </view-box>
        <foot-tab :times="yysj" @on-change="timeSure"></foot-tab>              
    </div>
</template>

<script>
import StoreList from '../common/store-list'
import DateTab from '../common/date-tab'
import FootTab from '../common/foot-tab'
import { Divider, Checker, CheckerItem, dateFormat, ViewBox } from 'vux'
export default {
    name: 'appointment_time',
    data () {
        return {
            selectTime: '',
            selectDate: '',
            timeArrs: []
        }
    },
    methods: {
        dateChange (v) {
            this.selectDate = v;
        },
        disableTime (time) {
            let currentDate = dateFormat(new Date(),'YYYY-MM-DD');
            if(currentDate === this.selectDate){
                let t1 = (new Date(String(currentDate+" "+time).replace(/-/g,"/"))).getTime();
                let t2 = (new Date()).getTime();
                return t2>t1;
            }
            return false;
        },
        timeArr (type) {
            let base = '2017/01/01 ';
            let s = (new Date(base+'12:00:00')).getTime();
            let z = (new Date(base+'18:00:00')).getTime();
            let w = (new Date(base+'24:00:00')).getTime();
            switch(type){
                case 1: 
                    return this.timeArrs.filter(e=>{
                        let t = (new Date(base+""+e)).getTime();
                        return t<s;
                    }).map(e=>{
                       return dateFormat(new Date(base+""+e),'HH:mm');
                    })
                break;
                case 2: 
                    return this.timeArrs.filter(e=>{
                        let t = (new Date(base+""+e)).getTime();
                        return t<z&&(t>s||t===s);
                    }).map(e=>{
                       return dateFormat(new Date(base+""+e),'HH:mm');
                    })                
                break;
                case 3: 
                    return this.timeArrs.filter(e=>{
                        let t = (new Date(base+""+e)).getTime();
                        return t<w&&(t>z||t===z);
                    }).map(e=>{
                       return dateFormat(new Date(base+""+e),'HH:mm');
                    })                
                break;
            }
        },
        init () {
            if(this.appointment_start_at){
                this.selectTime = dateFormat(new Date(String(this.appointment_start_at).replace(/-/g,"/")),'HH:mm');                
            }else{
                this.selectTime = '';
            }
        },
        timeSure (state) {
            if(state){
                this.$store.dispatch('updateOrder',{
                    appointment_start_at: state
                });
                this.$router.push({
                    name: 'appointment_zxs'
                })
            }else{
                this.$vux.alert.show({
                    title: '提示',
                    content: '请选择预约时间'
                })                  
            }
        }
    },
    computed: {
        storeList () {
            return this.$store.state.common.storeList;
        },
        yysj () {
            if(this.selectDate&&this.selectTime){
                return this.selectDate+" "+this.selectTime;
            }else{
                return '请选择';
            }
        },
        appointment_start_at () {
            return this.$store.state.appointment.order.appointment_start_at;
        }
    },
    watch: {
        appointment_start_at () {
            this.init();
        }
    },
    mounted () {
        let query = this.$route.query;
        if(query.order_id){
            
        }
        let store_id = this.$store.state.appointment.store.id;
        if(!store_id){
            this.$router.push({
                name: 'appointment_store'
            })            
            return;
        }
        this.$store.commit('updateLoadingStatus',{
            isLoading: true
        });         
        this.$http.post('/shop/checkout/getStoreAppointmentTimePoints',{
            store_id
        }).then(res=>{
            this.timeArrs = res.data.time_points;
            this.timeArrs.sort();
            if(this.appointment_start_at){
                this.init();
            }         
            this.$store.commit('updateLoadingStatus',{
                isLoading: false
            });                
        }).catch(e=>{
            this.$store.commit('updateLoadingStatus',{
                isLoading: false
            }); 
        })
    },
    components: {
        StoreList,
        Divider,
        Checker,
        CheckerItem,
        DateTab,
        FootTab,
        ViewBox
    }
}
</script>

<style lang="less">

</style>
